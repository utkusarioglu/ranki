import { RankiPluginParser } from "@ranki/package-api";
// import rankiConfig from "../assets/ohm/2.0.62.ohm?raw";
// !TODO this needs to go
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const grammar = fs
  .readFileSync(
    path.join(fileURLToPath(import.meta.url), "../..", "assets/ohm/2.0.62.ohm"),
  )
  .toString();

export const rankiRichNumberV1ParserPlugin: RankiPluginParser = {
  type: "parser",
  name: "RankiRichNumberV1",
  dependencies: ["RankiBase"],
  grammar,
};
