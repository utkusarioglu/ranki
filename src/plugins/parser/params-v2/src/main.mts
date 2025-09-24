import { RankiPluginParser } from "@ranki/package-api";
// import rankiConfig from "../assets/ohm/2.0.62.ohm?raw";
// !TODO this needs to go
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { actions } from "./params-v2.action.mjs";

const version = "2.0.62";

const grammar = fs
  .readFileSync(
    path.join(
      fileURLToPath(import.meta.url),
      "../..",
      `assets/ohm/${version}.ohm`,
    ),
  )
  .toString();

export const rankiParamsV2ParserPlugin: RankiPluginParser = {
  type: "parser",
  name: "RankiParamsV2",
  version,
  dependencies: ["RankiConstantsV2"],
  grammar: () => grammar,
  actions: () => actions,
};

export type { ArgsAndParamsV2, ParamsV2Spec } from "./types.mjs";
