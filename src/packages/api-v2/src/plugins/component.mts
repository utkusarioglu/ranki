import type { RankiLanguageMergedConfig } from "../lang/config.mjs";
import { DeepPartial } from "../utils.mjs";

export interface RankiPluginComponent {
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
