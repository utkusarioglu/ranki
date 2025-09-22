import yaml from "yaml";
import * as fs from "node:fs";
import { parse } from "./main.mjs";
import path from "node:path";

const THROW_TESTS = "./assets/throw";
const throwTests = fs.readdirSync(THROW_TESTS);

function main(count: number) {
  const serialized = throwTests.reduce((a, c) => {
    if (c.endsWith("ranki")) {
      const contents = fs.readFileSync(path.join(THROW_TESTS, c)).toString();
      const items = contents.split("\n---\n");
      a.push(...items);
    }
    return a;
  }, [] as string[]);

  const parsed = [];
  serialized
    .slice(serialized.length - count, serialized.length)
    .forEach((c) => {
      try {
        parsed.push(
          parse(c, [
            // "RankiParamsV2",
            // "RankiFrameV2",
            // "RankiFrameV1",
            // "RankiRichText",
            "RankiRichNumber",
            // "RankiRichStructure",
          ]),
        );
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    });
  console.log(yaml.stringify(parsed));
}

main(+process.argv.at(-1));
