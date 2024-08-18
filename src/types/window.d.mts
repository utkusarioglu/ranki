import type { WindowRankiConfig } from "./ranki.d.mts";

interface CustomWindow extends Window {
  ranki: WindowRankiConfig;
}
