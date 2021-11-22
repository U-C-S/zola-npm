import { execFileSync } from "child_process";
import { getZolaPath } from "./path.js";

export function exec(...args) {
  execFileSync(getZolaPath(), args, { stdio: "inherit" });
}
