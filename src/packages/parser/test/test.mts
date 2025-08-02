import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { main } from "../src/main.mjs";
import * as yaml from "yaml";

const TESTS_ROOT = "./test";
const cases = fs
  .readdirSync(TESTS_ROOT)
  .map((relpath) => path.parse(path.join(TESTS_ROOT, relpath)))
  .filter((v) => v.ext === ".ranki")
  .map((input) => ({
    name: input.name,
    inputPath: path.join(input.dir, `${input.name}.ranki`),
    expectedPath: path.join(input.dir, `${input.name}.yaml`),
  }))
  .map(({ name, inputPath, expectedPath }) => ({
    name,
    input: {
      path: inputPath,
      content: fs
        .readFileSync(inputPath)
        .toString()
        .split("\n")
        .slice(1, -2)
        .join("\n"),
    },
    expected: {
      path: expectedPath,
      content: yaml.parse(fs.readFileSync(expectedPath).toString()),
    },
  }));

cases.forEach(({ name, input, expected }) => {
  it(name, () => {
    console.log(input.content);
    const response = main(input.content);
    expect(response).toEqual(expected.content);
  });
});
