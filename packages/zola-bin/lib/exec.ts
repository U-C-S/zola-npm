import { execFile, execFileSync } from "child_process";
import { promisify } from "util";
import { getZolaPath } from "./path.js";

// https://nodejs.org/api/child_process.html#child_processexecfilefile-args-options-callback
const execPromise = promisify(execFile);

/**
 * Calls zola binary file with the given arguments Asynchronously. Returns a promise.
 *
 * Reference: https://www.getzola.org/documentation/getting-started/cli-usage/
 * @param args as a array of strings
 */
export function exec(args: string[]) {
	return execPromise(getZolaPath(), args);
}

/**
 * Sync version of exec. Returns nothing, unlike its async counterpart.
 */
export function execSync(args: string[]) {
	execFileSync(getZolaPath(), args, { stdio: "inherit" });
}
