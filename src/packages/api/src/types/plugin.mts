import type * as ohm from "ohm-js";
import type { AstNode } from "./ast-node.mjs";

interface RenderParams {}

export type PluginComponentParser = (source: ohm.Node) => AstNode;
export type PluginComponentValidator = (a: AstNode) => AstNode;
export type PluginComponentRenderer = (params: RenderParams) => PluginRender;
export type PluginComponentTransformer = (params: RenderParams) => PluginRender;
export type FrameTagString = string;

interface PluginRender {
  element: HTMLElement;
}

interface PluginMetadata {
  name: string;
}

export interface PluginComponentStages {
  parser: PluginComponentParser;
  validator: PluginComponentValidator;
  transformer: PluginComponentTransformer;
  renderer: PluginComponentRenderer;
}

export type PluginComponentStage = keyof PluginComponentStages;

interface PluginComponent {
  tags: FrameTagString[];
  stages: () => Promise<PluginComponentStages>;
}

export interface Plugin {
  // parsers: Record<FrameTag, ParseHandler>;
  // renderers: Record<FrameTag, RenderHandler>;
  metadata: PluginMetadata;
  components: PluginComponent[];
}
