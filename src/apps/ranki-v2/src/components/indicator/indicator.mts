import type { RankiAppConfig } from "../../config/config.types.mts";

export function createIndicators(root: HTMLDivElement, config: RankiAppConfig) {
  const indicators = config.indicators;
  // @ts-expect-error
  const redArch = indicators.find(({ name }) => name === "red-arch");
  root.style.background = [
    // redArch?.style,
    // "radial-gradient(118% 105% at bottom center, transparent 85%, var(--palette-red-2-hex))",
  ].join("\n");
}
