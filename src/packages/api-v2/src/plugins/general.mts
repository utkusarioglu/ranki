import type { RankiPluginParser } from "./plugin.mjs";
import type { RankiPluginRenderer } from "./render.mjs";

export type RankiPlugin = RankiPluginParser | RankiPluginRenderer;
