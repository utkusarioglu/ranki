import { Parser } from "../src/_ranki_parser.js";
import { rankiDefaults } from "../src/_ranki_config.js";
import { readFileSync } from "node:fs";

const fieldContent = readFileSync("/workdir/tests/field.txt", { encoding: "utf-8" }, (err, data) =>
{
  if (err) {
    console.log(err);
  }
  return data.toString();
});

const ranki = {
  ...rankiDefaults,
  content: {
    "Field1": fieldContent
  }
};

const parser = new Parser(ranki);
const lines = parser.parseFields(["Field1"]);

console.log("Ast for Field1:");
console.log(JSON.stringify(lines[0], null, 2));
