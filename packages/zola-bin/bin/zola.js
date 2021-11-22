#!/usr/bin/env node

import childProcess from "child_process";
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);
const platform = process.platform;

const zolaPackages = {
  win32: { name: "zola-bin-win32", subpath: "zola.exe" },
  darwin: { name: "zola-bin-darwin", subpath: "bin/zola" },
  linux: { name: "zola-bin-linux", subpath: "bin/zola" },
};

function CurrentPlatformPackage() {
  if (platform in zolaPackages) {
    return zolaPackages[platform];
  }

  throw new Error(`Unsupported platform: ${platform}`);
}

function getZolaPath() {
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

childProcess.execFileSync(getZolaPath(), process.argv.slice(2), {
  stdio: "inherit",
});
