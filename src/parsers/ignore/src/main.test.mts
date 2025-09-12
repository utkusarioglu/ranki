import { parse } from "./main.mjs";
import { describe, expect, test } from "vitest";
import { getConfig, getCaseFiles } from "./helpers.mjs";

const configSrc = getConfig("2.0.46");
const caseFiles = getCaseFiles("./assets/cases");

caseFiles.forEach((s) => {
  describe(s.name, () => {
    if (s.skip) {
      return;
    }
    const describeType = s.only ? describe.only : describe;
    s.cases.forEach((c) => {
      describeType(c.description, () => {
        const response = parse(configSrc, c.input);

        Object.entries(c.tests).forEach(([name, expected]) => {
          test(name, () => {
            expect(response[name]).toStrictEqual(expected);
          });
        });
      });
    });
  });
});
