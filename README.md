# zola-npm

[![npm](https://img.shields.io/npm/v/zola-bin?label=zola-bin)](https://www.npmjs.com/package/zola-bin)
[![npm](https://img.shields.io/npm/v/@u-c-s/zola-linux-x64-gnu?label=zola-npm-built)](https://www.npmjs.com/package/@u-c-s/zola-linux-x64-gnu)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/getzola/zola?label=zola-official)](https://github.com/getzola/zola/releases)

## What is Zola ?

Zola is a static site generator (SSG), similar to Hugo, Pelican, and Jekyll. It is written in Rust and uses the [Tera](https://tera.netlify.com/) template engine, which is similar to Jinja2, Django templates, Liquid, and Twig. Content is written in [CommonMark](https://commonmark.org/), a strongly defined, highly compatible specification of Markdown.

### Official Links

- [Website](https://www.getzola.org/)
- [Documentation](https://www.getzola.org/documentation/getting-started/overview/)
- [Forum](https://zola.discourse.group/)
- [Github Repo](https://github.com/getzola/zola)

This repository provides the zola binary wrapper and the create-zola-site script as NPM packages.

### Why Zola as a NPM package ??

This package provides Node.js bindings for Zola, compiled directly from its source code and exposed via [Node-API](https://nodejs.org/api/n-api.html) or standard JavaScript calls. This approach ensures performance close to that of native binaries while offering the convenience of an npm package, making deployment easier across various environments due to Node.js' extensive ecosystem and support.

## Usage

Add it as a dependency into your project or a new one, using....

```bash
npm i zola-bin
```

or

```bash
npm i -g zola-bin
```

### From CLI

Format: `zola-bin [args]`

`args` are same as official zola [CLI](https://www.getzola.org/documentation/getting-started/cli-usage/). Additionally, In your project's `package.json` file, you call it inside a script after adding it as a devDependency.

```json
"scripts": {
    "dev": "zola-bin serve --port 7000 --open",
    "build": "zola-bin build"
}
```

---

### JavaScript API

```typescript
import zola, { execZola, getZolaPath } from "zola-bin";

execZola([....args]); // same as calling zola-bin [args] from command line
```

Following methods are just a wrapper around `execZola`.

Check out for usage - https://www.getzola.org/documentation/getting-started/cli-usage

```typescript
interface buildOps {
	base_url?: string;
	output_dir?: string;
	config_file?: string;
}
interface serveOps extends buildOps {
	open?: boolean;
	port?: number;
	interface?: string;
}

declare const zola: {
	build(options?: buildOps): void;

	serve(options?: serveOps): void;

	check(): void;

	init(name?: string): void;
};

export default zola;
```

## Getting Started with Create Zola Site

With NPM installed, you can quickly setup a new _Zola_ site with the following command:

```bash
npx create-zola-site -n {NAME}
```

This will create a new directory `{NAME}` and initializes the necessary files in it. Note that the site created using this process depends on Node.js, so you might see `package.json` and `node_modules` in the directory. This doesn't mean it any works different than actual template initialized by Zola. But This template will simplify the process of creating, building and deploying a new site.

if you already have a existing site, you can add the `zola-bin` NPM package to make it work same as the one created with `create-zola-site`.

```bash
npm init
npm i -D zola-bin
```

And then you can add the following script to your `package.json` file:

```json
"scripts": {
    "dev": "zola-bin serve --open",
    "build": "zola-bin build",
}
```

## FAQ

- What is the difference between Zola and create-zola-site template ?

  - Nothing, directory structure is pretty much the same and works the same.
  - create-zola-site template creates extra files - `package.json` and `node_modules`, with `zola-bin` npm package as a devDependency, which builds bindings from the source code and exposes them as node.js function calls.

- Why would I use this instead of the official one ?

  - Because for few who are used to NPM, this package makes it feel more like its a part of NPM ecosystem.
  - Easyily deploy the sites since Node.js and NPM are accepted by most of the hosting services.
  - Simple installation and usage.
