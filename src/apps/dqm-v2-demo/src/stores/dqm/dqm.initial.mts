import type { DqmParseInputStructured } from "@dqm/package-dqm-api-v2";

export const INPUTS: DqmParseInputStructured = JSON.parse(
  localStorage.getItem("current")!,
) || [
  {
    dqm: "hello dqm",
    theater: "A",
  },
  {
    dqm: "hello world!",
    theater: "B",
  },
];

export const AUTO_UPDATE =
  JSON.parse(localStorage.getItem("autoUpdate")!) || true;
