import fetch from "node-fetch";
import path from "path";
import fs from "fs";
import https from "https";

const ZolaGithubReleaseAPI = "https://api.github.com/repos/getzola/zola/releases";

async function CallGithubAPI(url) {
	const res = await fetch(url);
	return await res.json();
}

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

CallGithubAPI(ZolaGithubReleaseAPI).then((data) => {
	let latestRelease = data[0].assets;
	let downloadCacheDir = "./.cache/zola_bin";
	fs.mkdirSync(downloadCacheDir, { recursive: true });

	latestRelease.forEach((r) => {
		const destf = path.join(downloadCacheDir, r.name);
		const dest = fs.createWriteStream(destf);

		DownloadFile(r.browser_download_url, dest).then(() => {
			console.log("Downloaded latest release");
		});
	});
});
