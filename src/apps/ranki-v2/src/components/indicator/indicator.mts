import type {
  RankiAppConfig,
  RankiIndicatorDefinition,
} from "../../config/config.types.mts";
import { assertExists } from "../../error/assertions.mts";

export function createIndicators(root: HTMLDivElement, config: RankiAppConfig) {
  const indicators = config.indicators;
  const active: RankiIndicatorDefinition[] = [];
  // console.log({ indicators, cues: config.design.cueRecord });
  config.design.cueRecord.forEach((c) => {
    // console.log("c", c);
    if (!c.indicator || c.indicator === "none") {
      return;
    }
    const ind = indicators.find((v) => v.name === c.indicator);
    assertExists(ind, {
      why: "Indicator with the given name doesn't exist",
      details: { indicator: c.indicator, indicators },
    });
    active.push(ind);
    // return ind;
  });
  // const redArch = indicators.find(({ name }) => name === "red-arch");
  // console.log(active);
  root.style.background = active.map((v) => v.style).join(", ");
  //   [
  //   // redArch?.style,
  //   // "radial-gradient(118% 105% at bottom center, transparent 85%, var(--palette-red-2-hex))",
  // ].join("\n");
}
