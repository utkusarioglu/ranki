import type { RenderNode } from "@dqm/package-dqm-v2";

export type RankiRenderNode<GElement = HTMLElement> = RenderNode<GElement> & {
  refs?: Record<string, HTMLElement>;
  objects?: Record<string, any>;
};
