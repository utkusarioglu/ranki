import type { WindowRankiConfig } from "../config/config.d.mts";

interface CustomWindow extends Window {
  ranki: WindowRankiConfig;
}
