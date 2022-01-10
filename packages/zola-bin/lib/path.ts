import { createRequire } from "module";
import path from "path";
import { config } from "dotenv";
import { CurrentPlatformPackage } from "./platform.js";

const require = createRequire(import.meta.url);

/**
 * @returns {string} the path to the zola binary file
 */
export function getZolaPath() {
	config();
	const ZOLA_BINARY_PATH = process.env.ZOLA_BINARY_PATH;
	if (ZOLA_BINARY_PATH) {
		console.log(`Using Custom Zola binary path: ${ZOLA_BINARY_PATH}`);
		return ZOLA_BINARY_PATH;
	}

	const { name, subpath } = CurrentPlatformPackage();

	try {
		let x = require.resolve("zola-bin"); // ROOT\node_modules\zola-bin\dist\main.js
		return path.join(x, "../../../", name, subpath);
	} catch (e) {
		throw new Error("Could not find platform specific zola-bin");
	}
}
