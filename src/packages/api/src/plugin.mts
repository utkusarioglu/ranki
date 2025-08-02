import type * as ohm from "ohm-js";
import type { AstNode } from "./types.mjs";

interface RenderParams {}

export type PluginComponentParser = (source: ohm.Node) => AstNode;
export type PluginComponentValidator = (a: AstNode) => AstNode;
export type PluginComponentRenderer = (params: RenderParams) => PluginRender;
export type FrameTagString = string;

interface PluginRender {
  element: HTMLElement;
}

interface PluginMetadata {
  name: string;
}

interface PluginComponent {
  tags: FrameTagString[];
  parser: PluginComponentParser;
  validator: PluginComponentValidator;
  renderer: PluginComponentRenderer;
}

export interface Plugin {
  // parsers: Record<FrameTag, ParseHandler>;
  // renderers: Record<FrameTag, RenderHandler>;
  metadata: PluginMetadata;
  components: PluginComponent[];
}
