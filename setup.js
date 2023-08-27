import { copyFile, readFile, writeFile } from "fs/promises";
import { parse, stringify } from "smol-toml";

copyFile("src/lib.rs", "zola/src/lib.rs");
copyFile("src/build.rs", "zola/build.rs");

const zolaToml = await readFile("zola/Cargo.toml", { encoding: "utf8" });
const zolaTomlParsed = parse(zolaToml);

zolaTomlParsed["lib"] = {};
zolaTomlParsed["lib"]["crate-type"] = ["cdylib"];
zolaTomlParsed["build-dependencies"]["napi-build"] = "2.0.1";
zolaTomlParsed["dependencies"]["napi"] = {
	version: "2.13.3",
	"default-features": false,
	features: ["napi8"],
};

zolaTomlParsed["dependencies"]["napi-derive"] = "2.13.0";

let newZolaToml = stringify(zolaTomlParsed);
writeFile("zola/Cargo.toml", newZolaToml, { encoding: "utf8" });
