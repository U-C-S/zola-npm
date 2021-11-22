#!/usr/bin/env node

import childProcess from "child_process";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const platform = process.platform;
const ZOLA_BINARY_PATH = process.env.ZOLA_BINARY_PATH || ZOLA_BINARY_PATH;

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
  if (ZOLA_BINARY_PATH) {
    return ZOLA_BINARY_PATH;
  }

  const { pkgName, subpath } = CurrentPlatformPackage();

  try {
    return require.resolve(`${pkgName}/${subpath}`);
  } catch (e) {
    throw new Error("Could not find platform specific zola-bin");
  }
}

childProcess.execSync(getZolaPath(), process.argv.slice(2), {
  stdio: "inherit",
});
