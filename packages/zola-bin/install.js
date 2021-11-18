import os from "os";
import fetch from "node-fetch";
import findCacheDir from "find-cache-dir";

function getCacheDir() {
  return findCacheDir({ name: "zola-bin" });
}

function getOs() {
  const platform = os.platform();
  const arch = os.arch();

  let DownloadedFileNamePostfix;

  if (platform === "win32") {
    DownloadedFileNamePostfix = "pc-windows-msvc.zip";
  } 
  else if (platform === "darwin") {
    DownloadedFileNamePostfix = "apple-darwin.tar.gz";
  } 
  else {
    DownloadedFileNamePostfix = "unknown-linux-gnu.tar.gz";
  }

  return {
    DownloadedFileNamePostfix,
    platform,
    arch,
  };
}
