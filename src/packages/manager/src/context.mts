import type { CreateContextFunction, ParseContext } from "@ranki/package-api";
import { parse } from "./parse.mjs";

export const createContext: CreateContextFunction = (
  config,
  // parser,
  parserPlugins,
) => {
  const context: ParseContext = {
    config,
    methods: {
      parser: (p) => parse,
      parserPlugins,
    },
  };
  return context;
};
