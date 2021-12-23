import { execFileSync } from "child_process";
import { getZolaPath } from "./path.js";

/**
 * If arguments are in a Array
 * @param {string[]} args
 */
export function exec(args) {
  execFileSync(getZolaPath(), args, { stdio: "inherit" });
}
