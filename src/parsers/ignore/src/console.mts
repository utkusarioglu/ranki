// import { getConfig, getCaseFiles } from "./helpers.mjs";
import { parse } from "./main.mjs";
import yaml from "yaml";

// const CASES = "./assets/cases";
// const cases = fs.readdirSync(CASES);
// const configSrc = getConfig("2.0.58");
// const caseFiles = getCaseFiles("./assets/cases");
//

console.log(parse("hi"));

// caseFiles["rich-text"].cases.forEach((c) => {
//   const result = parse(configSrc, c.input);
//   console.log(yaml.stringify(JSON.parse(JSON.stringify(result))));
// });
