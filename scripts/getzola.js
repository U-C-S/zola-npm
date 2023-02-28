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

function DownloadFile(fileURL, dest) {
	return new Promise((resolve, reject) => {
		https
			.get(fileURL, (res1) => {
				https
					.get(res1.headers.location, (res2) => {
						res2.pipe(dest);
						res2.on("error", reject);
						res2.on("end", resolve);
					})
					.on("error", reject);
			})
			.on("error", reject);
	});
}

let api = await ZolaGithubReleasesAPI;
let latestReleases = api.data.assets;

fs.mkdirSync(downloadCacheDir, { recursive: true });

latestReleases.forEach((r) => {
	const destf = path.join(downloadCacheDir, r.name);
	const download_dest = fs.createWriteStream(destf);

	DownloadFile(r.browser_download_url, download_dest).then(() => {
		console.log("Downloaded " + r.name);

		if (r.name.includes("windows")) {
			let extract_dest = "./packages/zola-bin-win32/";
			extract(destf, { dir: path.resolve(extract_dest) });
		} else {
			let platform = r.name.includes("linux") ? "linux" : "darwin";
			let extract_dest = "./packages/zola-bin-" + platform + "/bin";
			fs.mkdirSync(extract_dest, { recursive: true });
			tar.x({ C: extract_dest, file: destf });
		}

		console.log("Extracted " + r.name);
	});
});
