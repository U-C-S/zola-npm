const platform = process.platform;

const zolaPackages = {
  win32: { name: "zola-bin-win32", subpath: "zola.exe" },
  darwin: { name: "zola-bin-darwin", subpath: "bin/zola" },
  linux: { name: "zola-bin-linux", subpath: "bin/zola" },
};

export function CurrentPlatformPackage() {
  if (platform in zolaPackages) {
    return zolaPackages[platform];
  }

  throw new Error(`Unsupported platform: ${platform}`);
}
