// import { getConfig, getCaseFiles } from "./helpers.mjs";
import yaml from "yaml";
import * as fs from "node:fs";
import { parse } from "./main.mjs";
import path from "node:path";

const THROW_TESTS = "./assets/throw";
const throwTests = fs.readdirSync(THROW_TESTS);

const serialized = throwTests.reduce((a, c) => {
  if (c.endsWith("ranki")) {
    const contents = fs.readFileSync(path.join(THROW_TESTS, c)).toString();
    const items = contents.split("\n---\n");
    a.push(...items);
  }
  return a;
}, [] as string[]);

const parsed = [];
serialized.forEach((c) => {
  try {
    parsed.push(parse(c));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
});
console.log(yaml.stringify(parsed));
