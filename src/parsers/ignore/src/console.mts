import { getConfig, getCaseFiles } from "./helpers.mjs";
import { parse } from "./main.mjs";
import yaml from "yaml";

// const CASES = "./assets/cases";
// const cases = fs.readdirSync(CASES);
const configSrc = getConfig("2.0.46");
const caseFiles = getCaseFiles("./assets/cases");

const result = parse(configSrc, caseFiles["text"].cases[1].input);

console.log(yaml.stringify(JSON.parse(JSON.stringify(result))));
