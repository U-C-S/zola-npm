import { execFileSync } from "child_process";
// import { promisify } from "util";
import { getZolaPath } from "./path.js";

// https://nodejs.org/api/child_process.html#child_processexecfilefile-args-options-callback
// const execPromise = promisify(execFile);

/**
 * Synchronously calls zola binary file with the given arguments
 *
 * Reference: https://www.getzola.org/documentation/getting-started/cli-usage/
 * @param args as a array of strings
 */
function execZola(args: string[]) {
	try {
		execFileSync(getZolaPath(), args, { stdio: "inherit" });
	} catch (error: any) {
		console.error(error.message);
	}
}

interface buildOps {
	base_url?: string;
	output_dir?: string;
	config_file?: string;
}

interface serveOps extends buildOps {
	port?: number;
	interface?: string;
	open?: boolean;
}

function ArgsParse(options?: serveOps) {
	const postArgs = [];
	const preArgs = [];

	if (options?.base_url) {
		postArgs.push("--base-url", options.base_url);
	}
	if (options?.output_dir) {
		postArgs.push("--output-dir", options.output_dir);
	}
	if (options?.config_file) {
		preArgs.push("--config", options.config_file);
	}
	if (options?.interface) {
		postArgs.push("--interface", options.interface);
	}
	if (options?.port) {
		postArgs.push("--port", options.port.toString());
	}
	if (options?.open) {
		postArgs.push("--open");
	}

	return { preArgs, postArgs };
}

const zola = {
	/**
	 * https://www.getzola.org/documentation/getting-started/cli-usage/#build
	 */
	build(options?: buildOps) {
		const { preArgs, postArgs } = ArgsParse(options);
		return execZola([...preArgs, "build", ...postArgs]);
	},

	/**
	 * https://www.getzola.org/documentation/getting-started/cli-usage/#serve
	 */
	serve(options?: serveOps) {
		const { preArgs, postArgs } = ArgsParse(options);
		return execZola([...preArgs, "serve", ...postArgs]);
	},

	/**
	 * https://www.getzola.org/documentation/getting-started/cli-usage/#check
	 */
	check() {
		return execZola(["check"]);
	},

	/**
	 * prints help as stdout
	 */
	help(cmdHelp?: "build" | "serve" | "check" | "init") {
		let args = cmdHelp ? [cmdHelp] : [];
		return execZola([...args, "--help"]);
	},

	/**
	 * https://www.getzola.org/documentation/getting-started/cli-usage/#init
	 */
	init(name?: string) {
		let args = name ? ["init", name] : ["init"];

		return execZola(args);
	},
};

export { execZola, zola };
