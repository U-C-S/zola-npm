import { createRequire } from "module";
import path from "path";
import { CurrentPlatformPackage } from "./platform.js";

const require = createRequire(import.meta.url);

export function getZolaPath() {
  // const ZOLA_BINARY_PATH = process.env.ZOLA_BINARY_PATH;
  // if (ZOLA_BINARY_PATH) {
  //   return ZOLA_BINARY_PATH;
  // }

  const { name, subpath } = CurrentPlatformPackage();

  try {
    let x = require.resolve("zola-bin");
    x = path.join(x, "../../", name, subpath);
    console.log(x);
    return x;
  } catch (e) {
    throw new Error("Could not find platform specific zola-bin");
  }
}
