# zola-npm

This repository hosts the source code for following NPM packages

- [zola-bin](packages/zola-bin)
- [create-zola-site](packages/create-zola-site)

## What is Zola ?

Zola is a static site generator (SSG), similar to Hugo, Pelican, and Jekyll. It is written in Rust and uses the [Tera](https://tera.netlify.com/) template engine, which is similar to Jinja2, Django templates, Liquid, and Twig. Content is written in [CommonMark](https://commonmark.org/), a strongly defined, highly compatible specification of Markdown.

### Official Links

- [Website](https://www.getzola.org/)
- [Documentation](https://www.getzola.org/documentation/getting-started/overview/)
- [Forum](https://zola.discourse.group/)
- [Github Repo](https://github.com/getzola/zola)

This repository provides the zola binary wrapper and the create-zola-site script as NPM packages.

## Getting Started

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
  - create-zola-site template creates extra files - `package.json` and `node_modules`, with `zola-bin` npm package as a devDependency, which is wrapper around zola binaries taken from zola official github repo releases.

- Why would I use this instead of the official one ?

  - Because for few who are used to NPM, this package makes it feel more like its a part of NPM ecosystem.
  - Easyily deploy the sites since Node.js and NPM are accepted by most of the hosting services.
  - Simple installation and usage.

- Any limitations ?

  - Node.js overhead which might be add 1-2 seconds to the cold start when starting a dev server.
