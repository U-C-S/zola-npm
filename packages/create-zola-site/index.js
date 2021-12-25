#!/usr/bin/env node

import readline from "readline";
import { readFile, writeFile } from "fs/promises";
import { execSync } from "child_process";
import { promisify } from "util";
import { execZola } from "zola-bin";
import yargs from "yargs";

let args = yargs(process.argv.slice(2)).argv;

let PROJECT_NAME;

if (args.name || args.n) {
	PROJECT_NAME = args.name || args.n;
} else {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	const question = promisify(rl.question).bind(rl);

	PROJECT_NAME = await question("Enter project name: ");

	rl.close();
}

let zola_args = ["init", "--force"];
zola_args.push(PROJECT_NAME);

execZola(zola_args);

const thisPackageJson = JSON.parse(await readFile(new URL("./package.json", import.meta.url)));

const packageJson = {
	name: PROJECT_NAME.toLowerCase(),
	private: true,
	scripts: {
		dev: "zola-bin serve --open",
		build: "zola-bin build",
	},
	dependencies: {
		"zola-bin": thisPackageJson.dependencies["zola-bin"],
	},
};

writeFile(`${PROJECT_NAME}/package.json`, JSON.stringify(packageJson, null, 2)).then(() => {
	console.log("Created package.json");
	console.log("Installing dependencies...");
	execSync(`cd ${PROJECT_NAME} && npm install`);
});
