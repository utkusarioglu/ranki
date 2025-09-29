import type {
  CreateContextFunction,
  ParseContext,
  RankiLanguageConfig,
  RankiLanguageContextConfig,
} from "@ranki/package-api";
import { parse } from "./parse.mjs";

function createMergedConfig(
  contextConfig: RankiLanguageContextConfig,
): RankiLanguageConfig {
  const merged: RankiLanguageConfig["merged"] = {
    ...contextConfig.default,
    ...contextConfig.user,
    plugins: {
      standards: contextConfig.default.plugins.standards,
      requested: contextConfig.user.plugins.requested,
    },
  };

  return {
    default: contextConfig.default,
    user: contextConfig.user,
    merged,
  };
}

export const createContext: CreateContextFunction = (
  contextConfig,
  // parser,
  parserPlugins,
) => {
  const context: ParseContext = {
    config: createMergedConfig(contextConfig),
    methods: {
      parser: (p) => parse,
      parserPlugins,
    },
  };
  return context;
};
