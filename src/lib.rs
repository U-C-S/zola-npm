use std::{
    convert::TryInto,
    fs::create_dir,
    net::{IpAddr, Ipv4Addr},
    path::{Path, PathBuf},
    sync::LazyLock,
    time::Instant,
};

use clap::{CommandFactory, Parser};
use cli::{Cli, Command};
use env_logger::Env;
use errors::anyhow;
use log;
use time::UtcOffset;
use utils::{
    fs::create_file,
    net::{get_available_port, port_is_available},
};

use napi_derive::napi;

mod cli;
mod cmd;
mod fs_utils;
mod messages;
mod prompt;

#[napi]
pub fn raw_zola_build(
    root_dir: String,
    config_file: String,
    base_url: Option<String>,
    output_dir: Option<String>,
    force: bool,
    drafts: bool,
    minify: bool,
) {
    let _ = cmd::build(
        Path::new(&root_dir),
        Path::new(&config_file),
        base_url.as_deref(),
        output_dir.as_ref().map(|t| Path::new(t.as_str())),
        force,
        drafts,
        minify,
    );
}

// ----------- code from cmd/init.rs -----------

const CONFIG: &str = r#"
# The URL the site will be built for
base_url = "%BASE_URL%"

# Whether to automatically compile all Sass files in the sass directory
compile_sass = %COMPILE_SASS%

# Whether to build a search index to be used later on by a JavaScript library
build_search_index = %SEARCH%

[markdown]

[markdown.highlighting]
theme = "catppuccin-mocha"

[extra]
# Put all your custom variables here
"#;

fn init_populate(path: &Path, compile_sass: bool, config: &str) -> errors::Result<()> {
    if !path.exists() {
        create_dir(path)?;
    }
    create_file(&path.join("config.toml"), config)?;
    create_dir(path.join("content"))?;
    create_dir(path.join("templates"))?;
    create_dir(path.join("static"))?;
    create_dir(path.join("themes"))?;
    if compile_sass {
        create_dir(path.join("sass"))?;
    }

    Ok(())
}

// ----------- end of code from cmd/init.rs -----------

#[napi]
pub fn raw_zola_init(
    name: String,
    base_url: Option<String>,
    compile_sass: Option<bool>,
    search: Option<bool>,
) {
    let path = Path::new(&name);
    let compile_sass = compile_sass.unwrap_or(true);
    let config = CONFIG
        .trim_start()
        .replace("%BASE_URL%", &base_url.unwrap_or(String::from("https://example.com")))
        .replace("%COMPILE_SASS%", &format!("{}", compile_sass))
        .replace("%SEARCH%", &format!("{}", search.unwrap_or(false)));
    init_populate(path, compile_sass, &config).unwrap();
}

#[napi]
pub fn raw_zola_check(
    root_dir: String,
    config_file: String,
    base_path: Option<String>,
    base_url: Option<String>,
    drafts: bool,
    skip_external_links: bool,
) {
    let _ = cmd::check(
        Path::new(&root_dir),
        Path::new(&config_file),
        base_path.as_ref().map(|t| t.as_str()),
        base_url.as_deref(),
        drafts,
        skip_external_links,
    );
}

#[napi]
pub fn raw_zola_serve(
    root_dir: String,           //&Path,
    interface: String,          //&str,
    port: u32,                  //u16,
    output_dir: Option<String>, //Option<&Path>,
    force: bool,
    base_url: Option<String>, //&str,
    config_file: String,      // &Path,
    open: bool,
    store_html: bool,
    drafts: bool,
    fast: bool,
    no_port_append: bool,
    extra_watch_paths: Vec<String>,
    debounce: Option<u32>,
) {
    let interface: IpAddr = {
        if interface.is_empty() {
            IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1))
        } else {
            interface.parse().unwrap()
        }
    };
    let _ = cmd::serve(
        Path::new(&root_dir),
        interface,
        port.try_into().unwrap(),
        output_dir.as_ref().map(|t| Path::new(t.as_str())),
        force,
        base_url.as_deref(),
        Path::new(&config_file),
        open,
        drafts,
        store_html,
        fast,
        no_port_append,
        UtcOffset::current_local_offset().unwrap_or(UtcOffset::UTC),
        extra_watch_paths,
        debounce.unwrap_or(1000).into(),
    );
}

static SHOULD_COLOR_OUTPUT: LazyLock<anstream::ColorChoice> =
    LazyLock::new(|| anstream::AutoStream::choice(&std::io::stderr()));

#[napi]
pub fn zola_command_parse(input: Vec<String>) {
    let cli = Cli::parse_from(input);

    // ------- same as main.rs -------
    // ensure that logging uses the “info” level for anything in Zola by default
    let env = Env::new().default_filter_or("zola=info");
    env_logger::Builder::from_env(env)
        .format(|f, record| {
            use std::io::Write;
            match record.level() {
                // INFO is used for normal CLI outputs, which we want to print with a little less noise
                log::Level::Info => {
                    writeln!(f, "{}", record.args())
                }
                _ => {
                    use anstyle::*;
                    let style = Style::new()
                        .fg_color(Some(Color::Ansi(match record.level() {
                            log::Level::Error => AnsiColor::Red,
                            log::Level::Warn => AnsiColor::Yellow,
                            log::Level::Info => AnsiColor::Green,
                            log::Level::Debug => AnsiColor::Cyan,
                            log::Level::Trace => AnsiColor::BrightBlack,
                        })))
                        .bold();
                    // Because the formatter erases the “terminal-ness” of stderr, we manually set the color behavior here.
                    let mut f = anstream::AutoStream::new(
                        f as &mut dyn std::io::Write,
                        *SHOULD_COLOR_OUTPUT,
                    );
                    writeln!(f, "{style}{:5}{style:#} {}", record.level().as_str(), record.args())
                }
            }
        })
        .init();

    let cli_dir: PathBuf = cli.root.canonicalize().unwrap_or_else(|e| {
        messages::unravel_errors(
            &format!("Could not find canonical path of root dir: {}", cli.root.display()),
            &e.into(),
        );
        std::process::exit(1);
    });

    match cli.command {
        Command::Init { name, force } => {
            if let Err(e) = cmd::create_new_project(&name, force) {
                messages::unravel_errors("Failed to create the project", &e);
                std::process::exit(1);
            }
        }
        Command::Build { base_url, output_dir, force, drafts, minify } => {
            log::info!("Building site...");
            let start = Instant::now();
            let (root_dir, config_file) = get_config_file_path(&cli_dir, &cli.config);
            match cmd::build(
                &root_dir,
                &config_file,
                base_url.as_deref(),
                output_dir.as_deref(),
                force,
                drafts,
                minify,
            ) {
                Ok(()) => messages::report_elapsed_time(start),
                Err(e) => {
                    messages::unravel_errors("Failed to build the site", &e);
                    std::process::exit(1);
                }
            }
        }
        Command::Serve {
            interface,
            mut port,
            output_dir,
            force,
            base_url,
            drafts,
            open,
            store_html,
            fast,
            no_port_append,
            extra_watch_path,
            debounce,
        } => {
            if port != 1111 && !port_is_available(interface, port) {
                log::error!("The requested port is not available");
                std::process::exit(1);
            }

            if !port_is_available(interface, port) {
                port = get_available_port(interface, 1111).unwrap_or_else(|| {
                    log::error!("No port available");
                    std::process::exit(1);
                });
            }

            let (root_dir, config_file) = get_config_file_path(&cli_dir, &cli.config);
            log::info!("Building site...");
            if let Err(e) = cmd::serve(
                &root_dir,
                interface,
                port,
                output_dir.as_deref(),
                force,
                base_url.as_deref(),
                &config_file,
                open,
                drafts,
                store_html,
                fast,
                no_port_append,
                UtcOffset::current_local_offset().unwrap_or(UtcOffset::UTC),
                extra_watch_path,
                debounce,
            ) {
                messages::unravel_errors("Failed to serve the site", &e);
                std::process::exit(1);
            }
        }
        Command::Check { drafts, skip_external_links } => {
            log::info!("Checking site...");
            let start = Instant::now();
            let (root_dir, config_file) = get_config_file_path(&cli_dir, &cli.config);
            match cmd::check(&root_dir, &config_file, None, None, drafts, skip_external_links) {
                Ok(()) => messages::report_elapsed_time(start),
                Err(e) => {
                    messages::unravel_errors("Failed to check the site", &e);
                    std::process::exit(1);
                }
            }
        }
        Command::Completion { shell } => {
            let cmd = &mut Cli::command();
            clap_complete::generate(shell, cmd, cmd.get_name().to_string(), &mut std::io::stdout());
        }
    }

    // End of main.rs / fn main() copy
}

fn get_config_file_path(dir: &Path, config_path: &Path) -> (PathBuf, PathBuf) {
    let root_dir = dir.ancestors().find(|a| a.join(config_path).exists()).unwrap_or_else(|| {
        messages::unravel_errors(
            "",
            &anyhow!(
                "{} not found in current directory or ancestors, current_dir is {}",
                config_path.display(),
                dir.display()
            ),
        );
        std::process::exit(1);
    });

    // if we got here we found root_dir so config file should exist so we could theoretically unwrap safely
    let config_file_uncanonicalized = root_dir.join(config_path);
    let config_file = config_file_uncanonicalized.canonicalize().unwrap_or_else(|e| {
        messages::unravel_errors(
            &format!("Could not find canonical path of {}", config_file_uncanonicalized.display()),
            &e.into(),
        );
        std::process::exit(1);
    });

    (root_dir.to_path_buf(), config_file)
}
