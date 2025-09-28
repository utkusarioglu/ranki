import { RankiPluginParser } from "@ranki/package-api";
import grammar from "../assets/ohm/2.0.62.ohm?raw";
// // !TODO this needs to go
// import fs from "node:fs";
// import { fileURLToPath } from "node:url";
// import path from "node:path";

const version = "2.0.62";

// const grammar = fs
//   .readFileSync(
//     path.join(
//       fileURLToPath(import.meta.url),
//       "../..",
//       `assets/ohm/${version}.ohm`,
//     ),
//   )
//   .toString();

export const rankiConstantsV2ParserPlugin: RankiPluginParser = {
  type: "parser",
  version,
  name: "RankiConstantsV2",
  dependencies: [],
  grammar: (c) => {
    console.log(c);
    const ohm = {};

    return grammar;
  },
  actions: () => ({}),
};

// !TODO shall I use aliases such as `Alternates` and `Single` here?
function alternates(items: string[]) {
  if (!Array.isArray(items)) {
    throw new Error(`This needs to be an array, ${items}`);
  }
  return items.join(" | ");
}
