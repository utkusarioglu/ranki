import type { RankiLanguageMergedConfig } from "../lang/config.mjs";
import type { DeepPartial } from "../utils.mjs";
import type { RankiPluginCommon } from "./general.mjs";

export interface RankiPluginComponent extends RankiPluginCommon {
  handler: string;
  list: ComponentPluginComponent[];
}

export type ComponentPluginComponentShorthand = Record<string, string[]>;
export type ComponentPluginComponentPositional = string[][];

export interface ComponentPluginComponent {
  chain: string;
  stages: {
    ast: {
      preprocess: (raw: string) => string;
      directives: DeepPartial<RankiLanguageMergedConfig>;
      params: {
        setting: {
          positional: ComponentPluginComponentPositional;
          shorthands: ComponentPluginComponentShorthand;
        };
        directive: {
          positional: ComponentPluginComponentPositional;
          shorthands: ComponentPluginComponentShorthand;
        };
      };
    };
  };
}
