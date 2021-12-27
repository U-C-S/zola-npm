#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "fs/promises";
import { execSync } from "child_process";
import prompts from "prompts";
import validateName from "validate-npm-package-name";
import yargs from "yargs";

console.log("create-zola-site......");

let args = yargs(process.argv.slice(2)).argv;

let PROJECT_NAME = "my-site";

if (args.name || args.n) {
	PROJECT_NAME = args.name || args.n;
	console.log(`Using project name: ${PROJECT_NAME}`);
} else {
	let { name } = await prompts({
		type: "text",
		name: "name",
		initial: PROJECT_NAME,
		message: "Enter a name for your project: ",
		validate: (value) => {
			let result = validateName(value.toLowerCase());
			if (result.validForNewPackages) {
				return true;
			} else {
				return result.warnings.join("\n");
			}
		},
	});

	PROJECT_NAME = name;
}

mkdir(PROJECT_NAME).then(() => {
	console.log("Created project directory: " + PROJECT_NAME);
});

const thisPackageJson = JSON.parse(await readFile(new URL("./package.json", import.meta.url)));

const packageJson = {
	name: PROJECT_NAME.toLowerCase(),
	private: true,
	scripts: {
		dev: "zola-bin serve --open",
		build: "zola-bin build",
	},
	dependencies: {
		"zola-bin": thisPackageJson.devDependencies["zola-bin"],
	},
};

const configToml = `
# For configuration options, see: https://www.getzola.org/documentation/getting-started/configuration/

title = "${PROJECT_NAME}"
base_url = "/"
description = "${PROJECT_NAME}, made with Zola"

theme = ""
compile_sass = true
`;

writeFile(`./${PROJECT_NAME}/config.toml`, configToml);

writeFile(`${PROJECT_NAME}/package.json`, JSON.stringify(packageJson, null, 2)).then(() => {
	console.log();
	console.log("Created package.json");
	console.log("Installing dependencies...");
	execSync(`cd ${PROJECT_NAME} && npm install`);
});

/*
- npx create-zola-site -n "my-site"
- npx create-zola-site
*/
