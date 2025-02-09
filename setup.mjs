import { copyFile, readFile, writeFile, rm } from "fs/promises";
import { parse, stringify } from "smol-toml";

copyFile("src/lib.rs", "zola/src/lib.rs");
copyFile("src/build.rs", "zola/build.rs");

const zolaToml = await readFile("zola/Cargo.toml", { encoding: "utf8" });
const zolaTomlParsed = parse(zolaToml);

delete zolaTomlParsed["bin"];
zolaTomlParsed["lib"] = {};
zolaTomlParsed["lib"]["crate-type"] = ["cdylib"];
zolaTomlParsed["build-dependencies"]["napi-build"] = "2.1.4";
zolaTomlParsed["dependencies"]["napi"] = {
	version: "2.16.15",
	"default-features": false,
	features: ["napi8"],
};
zolaTomlParsed["dependencies"]["napi-derive"] = "2.16.13";

let newZolaToml = stringify(zolaTomlParsed);
writeFile("zola/Cargo.toml", newZolaToml, { encoding: "utf8" });
rm("zola/src/main.rs", { force: true });
console.log("Modified the Zola's git submodule directory files.");
