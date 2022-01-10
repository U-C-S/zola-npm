import { execFileSync } from "child_process";
import { getZolaPath } from "./path.js";

/**
 * Synchronously calls zola binary file with the given arguments
 *
 * Reference: https://www.getzola.org/documentation/getting-started/cli-usage/
 * @param args as a array of strings containing the arguments
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

function buildArgsParse(options?: buildOps) {
	let postArgs = [];
	let preArgs = [];

	if (options?.base_url) {
		postArgs.push("--base-url", options.base_url);
	}
	if (options?.output_dir) {
		postArgs.push("--output-dir", options.output_dir);
	}
	if (options?.config_file) {
		preArgs.push("--config", options.config_file);
	}

	return { preArgs, postArgs };
}

/**
 * Provides methods as abstraction over directly calling zola commands
 */
const zola = {
	/**
	 * https://www.getzola.org/documentation/getting-started/cli-usage/#build
	 */
	build(options?: buildOps) {
		let { preArgs, postArgs } = buildArgsParse(options);
		return execZola([...preArgs, "build", ...postArgs]);
	},

	/**
	 * https://www.getzola.org/documentation/getting-started/cli-usage/#serve
	 */
	serve(options?: serveOps) {
		let { preArgs, postArgs } = buildArgsParse(options);

		if (options?.interface) {
			postArgs.push("--interface", options.interface);
		}
		if (options?.port) {
			postArgs.push("--port", options.port.toString());
		}
		if (options?.open) {
			postArgs.push("--open");
		}

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
