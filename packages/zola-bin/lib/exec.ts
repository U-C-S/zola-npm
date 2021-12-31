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
export function execZola(args: string[]) {
	try {
		execFileSync(getZolaPath(), args, { stdio: "inherit" });
	} catch (error: any) {
		console.error(error.message);
	}
}
