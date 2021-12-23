import { execFile, execFileSync } from "child_process";
import { getZolaPath } from "./path.js";

/**
 * Calls zola binary file with the given arguments Asynchronously.
 *
 * Reference: https://www.getzola.org/documentation/getting-started/cli-usage/
 * @param args as a array of strings
 */
export function exec(args: string[]) {
	return execFile(getZolaPath(), args);
}

/**
 * Sync version of exec.
 */
export function execSync(args: string[]) {
	execFileSync(getZolaPath(), args, { stdio: "inherit" });
}

// declare function execFile(
// 	file: string,
// 	args: string[],
// 	callback: (error: Error | null, stdout: string, stderr: string) => void
// ): ChildProcess;
