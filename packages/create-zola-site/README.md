Quickly initialize a new Zola site. Depends on [zola-bin](https://www.npmjs.com/package/zola-bin).

## Getting Started

With NPM installed, you can quickly setup a new _Zola_ site with the following command:

```bash
npx create-zola-site -n {NAME}
```

This will create a new directory `{NAME}` and initializes the necessary files in it. Then command `npm run dev` will start a development server on port 1111 by default.

### For existing zola sites

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

**Note**: The site created using this process depends on Node.js and [zola-bin](https://www.npmjs.com/package/zola-bin), unlike actual template initialized by Zola. But This template will simplify the process of creating, building and deploying a new site.

## What is Zola ?

Zola is a static site generator (SSG), similar to Hugo, Pelican, and Jekyll. It is written in Rust and uses the [Tera](https://tera.netlify.com/) template engine, which is similar to Jinja2, Django templates, Liquid, and Twig. Content is written in [CommonMark](https://commonmark.org/), a strongly defined, highly compatible specification of Markdown.

### Official Links

- [Website](https://www.getzola.org/)
- [Documentation](https://www.getzola.org/documentation/getting-started/overview/)
- [Forum](https://zola.discourse.group/)
- [Github Repo](https://github.com/getzola/zola)
