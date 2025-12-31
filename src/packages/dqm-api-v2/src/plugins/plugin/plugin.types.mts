import type {
  IDqmPluginRenderer,
  IDqmPluginRenderEngine,
} from "../../renderer/export.type.mjs";
import type { IDqmPluginComponentSet } from "../component/component-set.types.mjs";
import type { IDqmPluginGrammar } from "../grammar/export.types.mjs";

export type IDqmPlugin = IDqmPluginTypes[];

export type IDqmPluginTypes =
  | IDqmPluginComponentSet
  | IDqmPluginGrammar
  | IDqmPluginRenderEngine
  | IDqmPluginRenderer;

export type IDqmPluginExtends = { type: string };
