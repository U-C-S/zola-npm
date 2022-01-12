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

export default execZola;
