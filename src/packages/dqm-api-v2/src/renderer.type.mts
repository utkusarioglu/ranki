import type { DqmTransformOutput } from "./dqm.types.mjs";

export interface RenderReport {}

export type RenderRoots = Record<string, HTMLDivElement>;

export interface IDqmRenderer {
  render(trn: DqmTransformOutput, roots: RenderRoots): RenderReport;
}

export type IDqmRendererConstructor = new () => IDqmRenderer;
