# zola-bin

[![npm](https://img.shields.io/npm/v/zola-bin?label=zola-bin)](https://www.npmjs.com/package/zola-bin)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/getzola/zola?label=zola-latest)](https://github.com/getzola/zola/releases)

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

### From Scripts

In your project's `package.json` file, call it inside a script using `zola-bin [args]`

`args` are same as official zola [CLI](https://www.getzola.org/documentation/getting-started/cli-usage/)

```json
"scripts": {
    "dev": "zola-bin serve --port 7000 --open",
    "build": "zola-bin build"
}
```

### JavaScript API

```js
import { execZola } from "zola-bin";

let args = ["serve", "--open"];
execZola(args);
```
