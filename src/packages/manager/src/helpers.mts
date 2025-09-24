import fs from "node:fs";
import * as ohm from "ohm-js";
import type { PathLike } from "node:fs";
import path from "node:path";
import yaml from "yaml";
import assert from "node:assert";

export function getThrowCases(throwPath: PathLike) {
  const throws = fs.readdirSync(throwPath);
  const SPLITTER = "---";

  return throws.reduce((acc, t) => {
    acc.push(
      ...fs
        .readFileSync(path.join(throwPath.toString(), t))
        .toString()
        .split(SPLITTER),
    );

    return acc;
  }, [] as string[]);
}

export function getCaseFiles(casesPath: PathLike) {
  const cases = fs.readdirSync(casesPath);

  return cases.reduce((acc, basename) => {
    const caseSet = yaml.parse(
      fs.readFileSync(path.join(casesPath.toString(), basename)).toString(),
    );

    caseSet.cases.forEach((c) => {
      assert(c.input !== undefined);
      assert(c.input !== null);
      assert(c.tests !== undefined);
      assert(c.tests !== null);
      assert(Object.keys(c.tests).length > 0);
    });

    const filename = basename.split(".")[0];
    acc[filename] = caseSet;
    return acc;
  }, {});
}

// export function getConfig(languageVersion: string) {
//   const src = fs
//     .readFileSync(path.join("assets", "ohm", languageVersion, "1-config.ohm"))
//     .toString();

//   return ohm.grammar(src);
// }
