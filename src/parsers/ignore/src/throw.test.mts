import { describe, test, expect } from "vitest";
import { getConfig, getThrowCases } from "./helpers.mjs";

const cases = getThrowCases("assets/throw");
const RankiConfig = getConfig("");

console.log(cases);

describe.only("Throw", () => {
  cases.forEach((c) => {
    test(c, () => {});
  });
});
