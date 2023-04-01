# zola-bin

[![npm](https://img.shields.io/npm/v/zola-bin?label=zola-bin)](https://www.npmjs.com/package/zola-bin)
[![npm](https://img.shields.io/npm/v/zola-bin-linux?label=npm-zola-version)](https://www.npmjs.com/package/zola-bin-linux)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/getzola/zola?label=zola-official-latest)](https://github.com/getzola/zola/releases)

## What is Zola ?

Zola is a static site generator (SSG), similar to Hugo, Pelican, and Jekyll. It is written in Rust and uses the [Tera](https://tera.netlify.com/) template engine, which is similar to Jinja2, Django templates, Liquid, and Twig. Content is written in [CommonMark](https://commonmark.org/), a strongly defined, highly compatible specification of Markdown.

### Official Links

- [Website](https://www.getzola.org/)
- [Documentation](https://www.getzola.org/documentation/getting-started/overview/)
- [Forum](https://zola.discourse.group/)
- [Github Repo](https://github.com/getzola/zola)

## Why Zola as a NPM package ??

> Zola provides pre-built binaries for MacOS, Linux and Windows on its [GitHub release page](https://github.com/getzola/zola/releases).

This package can be used for calling the pre-built `Zola` binary through [Node](https://nodejs.org), making it a part of node's vast NPM ecosystem. This package is a cross-platform, easy to install and integrate with other NPM packages. Also, This package gets the binaries directly from Zola Releases Page.

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

Note: Only supports ESM

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

	help(cmdHelp?: "build" | "serve" | "check" | "init"): void;

	init(name?: string): void;
};

export default zola;
```

```ts
getZolaPath(): string; // returns path to zola binary
```

---

### Environment Variables

Supports adding a custom `zola` binary path. Create a `.env` file in your project root directory and add the following line:

```toml
ZOLA_BIN_PATH="./somePathToZolaFile"
```

or 

```bash
ZOLA_BIN_PATH="./somePathToZolaFile" zola-bin [args]
```
