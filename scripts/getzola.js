import fetch from "node-fetch";
import { Octokit } from "@octokit/rest";
import path from "path";
import fs from "fs";
import https from "https";
import zlib from "zlib";

// const ZolaGithubReleaseAPI = "https://api.github.com/repos/getzola/zola/releases";
console.log("Downloading Zola...");
let ZolaGithubReleasesAPI = new Octokit().repos.getReleaseByTag({
	owner: "getzola",
	repo: "zola",
	tag: "v0.15.2",
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

let downloadCacheDir = "./.cache/zola_bin";
fs.mkdirSync(downloadCacheDir, { recursive: true });

latestReleases.forEach((r) => {
	const destf = path.join(downloadCacheDir, r.name);
	const dest = fs.createWriteStream(destf);

	DownloadFile(r.browser_download_url, dest).then(() => {
		console.log("Downloaded " + r.name);
	});

	// zlib.unzipSync(destf);
});
