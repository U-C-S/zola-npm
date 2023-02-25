import path from "path";
import fs from "fs";
import https from "https";
import { Octokit } from "@octokit/rest";
import extract from "extract-zip";
import tar from "tar";

const ZOLA_VERSION = process.env.ZOLA_VERSION ? process.env.ZOLA_VERSION : fs.readFileSync("./zola-version.txt", "utf8");
const downloadCacheDir = "./.cache/zola_bin";

console.log(`Downloading Zola ${ZOLA_VERSION}...`);

let ZolaGithubReleasesAPI = new Octokit().repos.getReleaseByTag({
	owner: "getzola",
	repo: "zola",
	tag: ZOLA_VERSION,
});

/**
 *
 * @param {string} name
 * @param {string} fileURL
 * @param {fs.WriteStream} dest
 */
function DownloadFile(name, fileURL, dest) {
	const destf = path.join(downloadCacheDir, name);

	return new Promise((resolve, reject) => {
		https.get(fileURL, (res1) => {
			https.get(res1.headers.location, (res2) => {
				res2.pipe(dest);
				res2.on("error", reject);
				res2.on("end", () => {
					console.log("- Downloaded " + name);

					if (name.includes("windows")) {
						let extract_dest = "./packages/zola-bin-win32/";
						extract(destf, { dir: path.resolve(extract_dest) });
					} else {
						let platform = name.includes("linux") ? "linux" : "darwin";
						let extract_dest = "./packages/zola-bin-" + platform + "/bin";
						fs.mkdirSync(extract_dest, { recursive: true });
						tar.x({ C: extract_dest, file: destf });
					}

					console.log("-- Extracted " + name);

					return resolve();
				});
			});
		});
	});
}

let api = await ZolaGithubReleasesAPI;
let latestReleases = api.data.assets;

let promiseStore = [];

fs.mkdirSync(downloadCacheDir, { recursive: true });

latestReleases.forEach((r) => {
	const destf = path.join(downloadCacheDir, r.name);
	const download_dest = fs.createWriteStream(destf);

	promiseStore.push(DownloadFile(r.name, r.browser_download_url, download_dest));
});

Promise.all(promiseStore).then(() => {
	console.log("Downloaded all Zola binaries");
	process.exit();
});
