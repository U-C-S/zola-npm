import { NapiCli } from "@napi-rs/cli";

const buildOptions = {
	release: process.env.NODE_ENV === "prod",
	target: process.env.NAPI_BUILD_TARGET || undefined,
};

console.log("Building with options:", buildOptions);

new NapiCli().build({
	platform: true,
	release: buildOptions.release,
	target: buildOptions.target,
	manifestPath: "./zola/Cargo.toml",
	jsBinding: "packages/zola-bin/bindings.js",
	dts: "packages/zola-bin/bindings.d.ts",
	jsPackageName: "@u-c-s/zola",
	outputDir: "./",
});

// napi build --platform --release --manifest-path ./zola/Cargo.toml --dts packages/zola-bin/bindings.d.ts --js packages/zola-bin/bindings.js --js-package-name @u-c-s/zola -o ./