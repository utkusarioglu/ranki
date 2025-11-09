import type { RankiRenderNode } from "./plugin.type.mjs";

export type RenderFunctionReturn = RankiRenderNode;

export interface RenderClientOptions {
  scheme: "dark" | "light";
}
