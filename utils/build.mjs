import { NapiCli } from "@napi-rs/cli";

// const args = process.argv;

new NapiCli().build({
	platform: true,
	manifestPath: "./zola/Cargo.toml",
	jsBinding: "packages/zola-bin/bindings.js",
	dts: "packages/zola-bin/bindings.d.ts",
	jsPackageName: "@u-c-s/zola",
	outputDir: "./",
});
