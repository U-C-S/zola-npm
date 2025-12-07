import { rawZolaBuild, rawZolaCheck, rawZolaInit, rawZolaServe } from "../bindings.js";

interface BuildOptions {
	baseUrl?: string;
	outputDir?: string;
	force?: boolean;
	drafts?: boolean;
	minify?: boolean;
}

export function build(rootDir: string, configFile?: string, options?: BuildOptions) {
	rawZolaBuild(
		rootDir,
		configFile ?? rootDir + "/config.toml",
		options?.baseUrl,
		options?.outputDir,
		options?.force ?? false,
		options?.force ?? false,
		options?.minify ?? false
	);
}

interface ServeOptions {
	interface: string;
	port: number;
	outputDir?: string;
	force: boolean;
	baseUrl?: string;
	open: boolean;
	storeHtml: boolean;
	drafts: boolean;
	fast: boolean;
	noPortAppend: boolean;
	extraWatchPaths: Array<string>;
}

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

export function init(name: string, force: boolean = false) {
	rawZolaInit(name, force);
}

interface checkOptions {
	basePath: string | undefined | null;
	baseUrl: string | undefined | null;
	drafts: boolean;
	skipExternalLinks: boolean;
}

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
