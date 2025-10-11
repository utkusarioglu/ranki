import type { RankiLanguageMergedConfig } from "./config.mjs";

export interface RankiPluginComponent {
  handler: string;
  list: ComponentPluginComponent[];
}

export interface ComponentPluginComponent {
  chain: string;
  stages: {
    ast: {
      preprocess: (raw: string) => string;
      directives: RankiLanguageMergedConfig;
      params: {
        setting: {
          positional: string[][];
          shorthands: Record<string, string[]>;
        };
        directive: {
          positional: string[][];
          shorthands: Record<string, string[]>;
        };
      };
    };
  };
}
