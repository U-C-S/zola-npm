use std::{
    convert::TryInto,
    net::{IpAddr, Ipv4Addr},
    path::{Path, PathBuf},
    time::Instant,
};

use clap::{CommandFactory, Parser};
use cli::{Cli, Command};
use cmd::{build, check, create_new_project, serve};
use errors::anyhow;
use time::UtcOffset;
use utils::net::{get_available_port, port_is_available};

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
) {
    let _ = build(
        Path::new(&root_dir),
        Path::new(&config_file),
        base_url.as_deref(),
        output_dir.as_ref().map(|t| Path::new(t.as_str())),
        force,
        drafts,
    );
}

#[napi]
pub fn raw_zola_init(name: String, force: bool) {
    let _ = create_new_project(name.as_str(), force);
}

#[napi]
pub fn raw_zola_check(
    root_dir: String,
    config_file: String,
    base_path: Option<String>,
    base_url: Option<String>,
    drafts: bool,
) {
    let _ = check(
        Path::new(&root_dir),
        Path::new(&config_file),
        base_path.as_ref().map(|t| t.as_str()),
        base_url.as_deref(),
        drafts,
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
    drafts: bool,
    fast: bool,
    no_port_append: bool,
) {
    let interface: IpAddr = {
        if interface.is_empty() {
            IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1))
        } else {
            interface.parse().unwrap()
        }
    };
    let _ = serve(
        Path::new(&root_dir),
        interface,
        port.try_into().unwrap(),
        output_dir.as_ref().map(|t| Path::new(t.as_str())),
        force,
        base_url.as_deref(),
        Path::new(&config_file),
        open,
        drafts,
        fast,
        no_port_append,
        UtcOffset::current_local_offset().unwrap_or(UtcOffset::UTC),
    );
}

#[napi]
pub fn zola_command_parse(input: Vec<String>) {
    let cli = Cli::parse_from(input);

    //same as main.rs

    let cli_dir: PathBuf = cli.root.canonicalize().unwrap_or_else(|e| {
        messages::unravel_errors(
            &format!(
                "Could not find canonical path of root dir: {}",
                cli.root.display()
            ),
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
        Command::Build {
            base_url,
            output_dir,
            force,
            drafts,
        } => {
            console::info("Building site...");
            let start = Instant::now();
            let (root_dir, config_file) = get_config_file_path(&cli_dir, &cli.config);
            match cmd::build(
                &root_dir,
                &config_file,
                base_url.as_deref(),
                output_dir.as_deref(),
                force,
                drafts,
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
            fast,
            no_port_append,
        } => {
            if port != 1111 && !port_is_available(port) {
                console::error("The requested port is not available");
                std::process::exit(1);
            }

            if !port_is_available(port) {
                port = get_available_port(1111).unwrap_or_else(|| {
                    console::error("No port available");
                    std::process::exit(1);
                });
            }

            let (root_dir, config_file) = get_config_file_path(&cli_dir, &cli.config);
            console::info("Building site...");
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
                fast,
                no_port_append,
                UtcOffset::current_local_offset().unwrap_or(UtcOffset::UTC),
            ) {
                messages::unravel_errors("Failed to serve the site", &e);
                std::process::exit(1);
            }
        }
        Command::Check { drafts } => {
            console::info("Checking site...");
            let start = Instant::now();
            let (root_dir, config_file) = get_config_file_path(&cli_dir, &cli.config);
            match cmd::check(&root_dir, &config_file, None, None, drafts) {
                Ok(()) => messages::report_elapsed_time(start),
                Err(e) => {
                    messages::unravel_errors("Failed to check the site", &e);
                    std::process::exit(1);
                }
            }
        }
        Command::Completion { shell } => {
            let cmd = &mut Cli::command();
            clap_complete::generate(
                shell,
                cmd,
                cmd.get_name().to_string(),
                &mut std::io::stdout(),
            );
        }
    }

    // End of main.rs / fn main() copy
}

fn get_config_file_path(dir: &Path, config_path: &Path) -> (PathBuf, PathBuf) {
    let root_dir = dir
        .ancestors()
        .find(|a| a.join(config_path).exists())
        .unwrap_or_else(|| {
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
    let config_file = config_file_uncanonicalized
        .canonicalize()
        .unwrap_or_else(|e| {
            messages::unravel_errors(
                &format!(
                    "Could not find canonical path of {}",
                    config_file_uncanonicalized.display()
                ),
                &e.into(),
            );
            std::process::exit(1);
        });

    (root_dir.to_path_buf(), config_file)
}
