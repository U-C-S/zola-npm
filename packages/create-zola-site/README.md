Quickly initialize a new Zola site.

## Getting Started

With NPM installed, you can quickly setup a new _Zola_ site with the following command:

```bash
npx create-zola-site -n {NAME}
```

This will create a new directory `{NAME}` and initializes the necessary files in it. Note that the site created using this process depends on Node.js, so you might see `package.json` and `node_modules` in the directory. This doesn't mean it any works different than actual template initialized by Zola. But This template will simplify the process of creating, building and deploying a new site.

if you already have a existing site, you can add the `zola-bin` NPM package to make it work same as the one created with `create-zola-site`.

```bash
npm init
npm install zola-bin
```

And then you can add the following script to your `package.json` file:

```json
"scripts": {
    "dev": "zola-bin serve --open",
    "build": "zola-bin build",
}
```
