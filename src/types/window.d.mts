import type { WindowRankiConfig } from "../config/config.d.mjs";

interface CustomWindow extends Window {
  ranki: WindowRankiConfig;
}
