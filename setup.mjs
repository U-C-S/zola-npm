import { copyFile, readFile, writeFile } from "fs/promises";
import { parse, stringify } from "smol-toml";

copyFile("src/lib.rs", "zola/src/lib.rs");
copyFile("src/build.rs", "zola/build.rs");

const zolaToml = await readFile("zola/Cargo.toml", { encoding: "utf8" });
const zolaTomlParsed = parse(zolaToml);

zolaTomlParsed["lib"] = {};
zolaTomlParsed["lib"]["crate-type"] = ["cdylib"];
zolaTomlParsed["build-dependencies"]["napi-build"] = "2.1.0";
zolaTomlParsed["dependencies"]["napi"] = {
	version: "2.14.1",
	"default-features": false,
	features: ["napi8"],
};

zolaTomlParsed["dependencies"]["napi-derive"] = "2.14.4";

let newZolaToml = stringify(zolaTomlParsed);
writeFile("zola/Cargo.toml", newZolaToml, { encoding: "utf8" });
console.log("Modified the Zola's git submodule directory files.");
