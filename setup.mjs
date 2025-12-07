import { copyFile, readFile, writeFile, rm } from "fs/promises";
import { parse, stringify } from "smol-toml";

copyFile("src/lib.rs", "zola/src/lib.rs");
copyFile("src/build.rs", "zola/build.rs");

const zolaToml = await readFile("zola/Cargo.toml", { encoding: "utf8" });
const zolaTomlParsed = parse(zolaToml);

delete zolaTomlParsed["bin"];
zolaTomlParsed["lib"] = {};
zolaTomlParsed["lib"]["crate-type"] = ["cdylib"];
zolaTomlParsed["build-dependencies"]["napi-build"] = "2.3.1";
zolaTomlParsed["dependencies"]["napi"] = {
	version: "3.6.1",
	"default-features": false,
	features: ["napi9"],
};
zolaTomlParsed["dependencies"]["napi-derive"] = "3.4.0";

let newZolaToml = stringify(zolaTomlParsed);
writeFile("zola/Cargo.toml", newZolaToml, { encoding: "utf8" });
rm("zola/src/main.rs", { force: true });
console.log("Modified the Zola's git submodule directory files.");
