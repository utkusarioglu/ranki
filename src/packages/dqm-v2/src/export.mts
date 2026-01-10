import type {
  DqmParseInput,
  DqmParseInputString,
  DqmParseInputStructured,
  DqmParseOutput,
  DqmParseRole,
  DqmParseTheater,
  RenderRoots,
  IDqmRendererClientPreferences,
} from "@dqm/package-dqm-api-v2";

export { Dqm } from "./dqm.mjs";

// TODO this needs its own module
// TODO dqm should import all the types necessary for a consumer. The consumer shouldn't have to know about the api package.
export type {
  DqmParseTheater,
  DqmParseRole,
  DqmParseInput,
  DqmParseInputString,
  DqmParseInputStructured,
  DqmParseOutput,
  RenderRoots,
  IDqmRendererClientPreferences,
};
