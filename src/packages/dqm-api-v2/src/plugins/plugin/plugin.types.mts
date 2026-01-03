import type { DqmPluginName } from "../../export.types.mjs";
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

export type IDqmPluginTypeNames = IDqmPluginTypes["type"];

export type IDqmPluginExtends = { type: string };

export type PluginUrn<
  PluginType extends IDqmPluginTypeNames = IDqmPluginTypeNames,
> = `${PluginType}:${DqmPluginName}`;

export type PluginParserUrn = `parser:${DqmPluginName}`;
