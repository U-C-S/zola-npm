mod cli;
mod cmd;
mod messages;
mod prompt;

use std::{convert::TryInto, path::Path};

use cmd::{build, check, create_new_project, serve};
use napi_derive::napi;
use time::UtcOffset;

#[napi]
pub fn zola_build(
    root_dir: String,
    config_file: String,
    base_url: Option<String>,
    output_dir: Option<String>,
    force: bool,
    include_drafts: bool,
) {
    let _ = build(
        Path::new(&root_dir),
        Path::new(&config_file),
        base_url.as_deref(),
        output_dir.as_ref().map(|t| Path::new(t.as_str())),
        force,
        include_drafts,
    );
}

#[napi]
pub fn zola_init(name: String, force: bool) {
    let _ = create_new_project(name.as_str(), force);
}

#[napi]
pub fn zola_check(
    root_dir: String,
    config_file: String,
    base_path: Option<String>,
    base_url: Option<String>,
    include_drafts: bool,
) {
    let _ = check(
        Path::new(&root_dir),
        Path::new(&config_file),
        base_path.as_ref().map(|t| t.as_str()),
        base_url.as_deref(),
        include_drafts,
    );
}

#[napi]
pub fn zola_serve(
    root_dir: String,           //&Path,
    interface: String,          //&str,
    interface_port: u32,        //u16,
    output_dir: Option<String>, //Option<&Path>,
    base_url: String,           //&str,
    config_file: String,        // &Path,
    open: bool,
    include_drafts: bool,
    fast_rebuild: bool,
    no_port_append: bool,
) {
    let _ = serve(
        Path::new(&root_dir),
        &interface,
        interface_port.try_into().unwrap(),
        output_dir.as_ref().map(|t| Path::new(t.as_str())),
        &base_url,
        Path::new(&config_file),
        open,
        include_drafts,
        fast_rebuild,
        no_port_append,
        UtcOffset::current_local_offset().unwrap_or(UtcOffset::UTC),
    );
}
