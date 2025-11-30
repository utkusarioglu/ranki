import type { IDqmPluginComponentSet } from "./component/component-set.types.mjs";
import type { IDqmPluginGrammar } from "./grammar/export.types.mjs";

export type IDqmPlugin = (IDqmPluginComponentSet | IDqmPluginGrammar)[];

export type IDqmPluginExtends = { type: string };
