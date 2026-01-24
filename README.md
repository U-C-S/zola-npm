# zola-npm

[![npm](https://img.shields.io/npm/v/zola-bin?label=zola-bin-version)](https://www.npmjs.com/package/zola-bin)
[![npm](https://img.shields.io/npm/v/@u-c-s/zola-linux-x64-gnu?label=zola-npm-latest)](https://www.npmjs.com/package/@u-c-s/zola-linux-x64-gnu)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/getzola/zola?label=zola-official-latest)](https://github.com/getzola/zola/releases)

This package provides Node.js bindings, command-line and javascript API for **Zola**

Compiled directly from its source code and bindings exposed via [Node-API](https://nodejs.org/api/n-api.html), 
The performance is closer to that of native/official zola binaries while having the convenience of an npm 
package, making deployment easier across various environments/platforms wherever Node.js is supported.

## What's Zola ?

Zola is a static site generator (SSG), similar to Hugo, Pelican, and Jekyll. It is written in Rust and uses
the [Tera](https://tera.netlify.com/) template engine, which is similar to Jinja2, Django templates, Liquid,
and Twig. Content is written in [CommonMark](https://commonmark.org/), a strongly defined, highly compatible
specification of Markdown.

### Links

- [Website](https://www.getzola.org/)
- [Documentation](https://www.getzola.org/documentation/getting-started/overview/)
- [Forum](https://zola.discourse.group/)
- [Github Repo](https://github.com/getzola/zola)

## Supported Platforms

- win32 (x64)
- linux (x64)
- darwin (x64, arm64)

## Usage

Add it as a dev dependency into your npm project

```bash
npm i -D zola-bin
```

or

```bash
npm i -g zola-bin
```

### From CLI

Format: `npx zola-bin [args]`

Use the `args` from the official [Zola's CLI](https://www.getzola.org/documentation/getting-started/cli-usage/).

You can also add it to scripts in the `package.json` file

```json
"scripts": {
    "dev": "zola-bin serve --port 7000 --open",
    "build": "zola-bin build"
}
```

---

### JavaScript API

```typescript
import { build, init, check, serve } from "zola-bin";
```

Each of these methods are a wrapper around the CLI commands. You can refer to the [JSdoc of each function](lib/main.ts)
or the type definitions on how to use them.

```typescript
interface BuildOptions {
	baseUrl?: string;
	outputDir?: string;
	force?: boolean;
	drafts?: boolean;
	minify?: boolean;
}
export declare function build(rootDir: string, configFile?: string, options?: BuildOptions): void;

interface ServeOptions {
	interface: string;
	port: number;
	outputDir?: string;
	force: boolean;
	baseUrl?: string;
	open: boolean;
	storeHtml: boolean;
	drafts: boolean;
	fast: boolean;
	noPortAppend: boolean;
	extraWatchPaths: Array<string>;
	debounce?: number;
}
export declare function serve(rootDir: string, configFile?: string, options?: ServeOptions): void;

export declare function init(name: string): void;

interface checkOptions {
	basePath: string | undefined | null;
	baseUrl: string | undefined | null;
	drafts: boolean;
	skipExternalLinks: boolean;
}
export declare function check(rootDir: string, configFile?: string, options?: checkOptions): void;
```

## Getting Started with Create Zola Site

With NPM installed, you can quickly setup a new _Zola_ site with the following command:

```bash
npx create-zola-site -n {NAME}
```

This will create a new directory `{NAME}` and initializes the necessary files in it. Note that the site created
using this process depends on Node.js, so you might see `package.json` and `node_modules` in the directory.
This doesn't mean it any works different than actual template initialized by Zola. But This template will
simplify the process of creating, building and deploying a new site.

if you already have a existing site, you can add the `zola-bin` NPM package to make it work same as the one
created with `create-zola-site`.

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
  - create-zola-site template creates extra files - `package.json` and `node_modules`, with `zola-bin` npm
    package as a devDependency, which builds bindings from the source code and exposes them as node.js function calls.

- Why would I use this instead of the official one ?

  - For those who are used to NPM, this package makes it feel home
  - Easily deploy the sites since Node.js and NPM are accepted by most hosting services.
