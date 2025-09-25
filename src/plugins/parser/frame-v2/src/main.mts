import { RankiPluginParser } from "@ranki/package-api";
import { actions } from "./actions.mjs";
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

export const rankiFrameV2ParserPlugin: RankiPluginParser = {
  type: "parser",
  name: "RankiFrameV2",
  version,
  dependencies: ["RankiParamsV2"],
  grammar: () => grammar,
  actions: () => actions,
};
