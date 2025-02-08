import { zolaCommandParse } from "../bindings.js";

/**
 * Synchronously calls zola binary file with the given arguments
 *
 * Reference: https://www.getzola.org/documentation/getting-started/cli-usage/
 * @param args as a array of strings containing the arguments
 */
export function execZola(args: string[]) {
	try {
		zolaCommandParse(args);
		// execFileSync(getZolaPath(), args, { stdio: "inherit" });
	} catch (error: any) {
		console.error(error.message);
	}
}
