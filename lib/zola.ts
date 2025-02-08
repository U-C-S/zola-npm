import { execZola } from "./exec.js";

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
 *
 * For usage: https://www.getzola.org/documentation/getting-started/cli-usage
 */
const zola = {
	/**
	 * https://www.getzola.org/documentation/getting-started/cli-usage/#build
	 */
	build(options?: buildOps) {
		let { preArgs, postArgs } = buildArgsParse(options);
		execZola([...preArgs, "build", ...postArgs]);
	},

	/**
	 * build and serve the site using a local server
	 *
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

		execZola([...preArgs, "serve", ...postArgs]);
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
		execZola([...args, "--help"]);
	},

	/**
	 * https://www.getzola.org/documentation/getting-started/cli-usage/#init
	 */
	init(name?: string) {
		let args = name ? ["init", name] : ["init"];
		execZola(args);
	},
};

export default zola;
