import { exec, execSync } from "zola-bin";

exec(["--version"]).then((result) => {
	console.log(result.stdout);
});
console.log("1.--------------------------------");
execSync(["build", "--help"]);
console.log("2.--------------------------------");
