import fs from "node:fs";
import type { PathLike } from "node:fs";
import path from "node:path";
import yaml from "yaml";
import assert from "node:assert";

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

export function getConfig(languageVersion: string) {
  return fs
    .readFileSync(path.join("assets", "ohm", languageVersion, "1-config.ohm"))
    .toString();
}
