import type { DqmParseInputStructured } from "@dqm/package-dqm-api-v2";

export const INPUTS: DqmParseInputStructured =
  JSON.parse(localStorage.getItem("current")!) || [];

export const AUTO_UPDATE =
  JSON.parse(localStorage.getItem("autoUpdate")!) || true;
