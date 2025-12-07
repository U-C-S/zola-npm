import { rawZolaBuild, rawZolaCheck, rawZolaInit, rawZolaServe } from "../bindings.js";

interface BuildOptions {
	/**
	 * Override the `config.toml` `base_url`, useful for preview deployments.
	 */
	baseUrl?: string;
	/**
	 * Output directory instead of the default `public`
	 */
	outputDir?: string;
	/**
	 * Replace an existing output directory without prompting (mirrors the `--force` flag).
	 */
	force?: boolean;
	/**
	 * Include pages and sections marked as drafts.
	 */
	drafts?: boolean;
	/**
	 * Minify the generated HTML output (same effect as setting `minify_html` in the config).
	 */
	minify?: boolean;
}

/**
 * Build the whole site and write it to disk.
 *
 * Mirrors the `zola build` CLI command. Renders the project at `rootDir` and deletes/recreates
 * the output folder (default `public`).
 *
 * See https://www.getzola.org/documentation/getting-started/cli-usage/#build
 * @param rootDir The path where the Zola project files are located.
 * @param configFile Path to a config file other than `config.toml` in `rootDir`. Defaults to
 * `${rootDir}/config.toml` unless overridden.
 * @param options Additional build options.
 */
export function build(rootDir: string, configFile?: string, options?: BuildOptions) {
	rawZolaBuild(
		rootDir,
		configFile ?? rootDir + "/config.toml",
		options?.baseUrl,
		options?.outputDir,
		options?.force ?? false,
		options?.drafts ?? false,
		options?.minify ?? false
	);
}

interface ServeOptions {
	/**
	 * Interface to bind to (default `127.0.0.1`; use `0.0.0.0` to expose on your LAN).
	 */
	interface: string;
	/**
	 * Port for the dev server (defaults to `1111`).
	 */
	port: number;
	/**
	 * Output directory for generated assets instead of the default `public`.
	 */
	outputDir?: string;
	/**
	 * Use an existing output directory without prompting (required when `outputDir` already exists).
	 */
	force: boolean;
	/**
	 * Override the `base_url` used for links while serving (can differ from the bind interface).
	 */
	baseUrl?: string;
	/**
	 * Automatically open the served site in the default browser.
	 */
	open: boolean;
	/**
	 * Also persist rendered HTML/XML to disk rather than only keeping it in memory.
	 */
	storeHtml: boolean;
	/**
	 * Include draft content while serving.
	 */
	drafts: boolean;
	/**
	 * Rebuild only the minimum on change
	 */
	fast: boolean;
	/**
	 * Keep the provided `baseUrl` without appending the interface port when constructing links.
	 */
	noPortAppend: boolean;
	/**
	 * Extra directories to watch for live reload, relative to the project root.
	 */
	extraWatchPaths: Array<string>;
}

/**
 * Build and serve the site with live reload. Starts a local server (default `127.0.0.1:1111`),
 * and watches for changes.
 *
 * See https://www.getzola.org/documentation/getting-started/cli-usage/#serve
 * @param rootDir The path where the Zola project files are located.
 * @param configFile Path to a config file other than `config.toml` in `rootDir`. Defaults to
 * `${rootDir}/config.toml` unless overridden.
 * @param options Additional serve options.
 */
export function serve(rootDir: string, configFile?: string, options?: ServeOptions) {
	rawZolaServe(
		rootDir,
		options?.interface ?? "127.0.0.1",
		options?.port ?? 1111,
		options?.outputDir,
		options?.force ?? false,
		options?.baseUrl,
		configFile ?? rootDir + "/config.toml",
		options?.open ?? false,
		options?.storeHtml ?? false,
		options?.drafts ?? false,
		options?.fast ?? false,
		options?.noPortAppend ?? false,
		options?.extraWatchPaths ?? []
	);
}

/**
 * Initialize a new Zola site/project via CLI prompting.
 *
 * See https://www.getzola.org/documentation/getting-started/cli-usage/#init
 * @param name Directory to initialize. (use `.` to target the current working directory)
 * @param force Try to populate a non-empty directory.
 */
export function init(name: string, force: boolean = false) {
	rawZolaInit(name, force);
}

interface checkOptions {
	/**
	 * Root to load when checking. defaults to `rootDir`.
	 */
	basePath: string | undefined | null;
	/**
	 * Override the `base_url` used while resolving links during the check.
	 */
	baseUrl: string | undefined | null;
	/**
	 * Include draft content during the validation run.
	 */
	drafts: boolean;
	/**
	 * Skip fetching external links while still verifying internal ones.
	 */
	skipExternalLinks: boolean;
}

/**
 * Validate the site without writing files.
 *
 * Renders the project at `rootDir` using the provided config file, then checks
 * generated links (including external links unless disabled).
 *
 * See https://www.getzola.org/documentation/getting-started/cli-usage/#check
 * @param rootDir The path where the Zola project files are located.
 * @param configFile Path to a config file other than `config.toml` in `rootDir`.
 * @param options Additional check options
 */
export function check(rootDir: string, configFile?: string, options?: checkOptions) {
	rawZolaCheck(
		rootDir,
		configFile ?? rootDir + "/config.toml",
		options?.basePath,
		options?.baseUrl,
		options?.drafts ?? false,
		options?.skipExternalLinks ?? false
	);
}
