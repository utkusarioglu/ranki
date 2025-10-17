import type {
  // RankiLangParseSpecs,
  RankiLangAstContext,
  // RankiLangParseReport,
  // RankiLangParserPluginParseHandler,
  RankiLangParseHandlerFunction,
} from "@ranki/package-api-v2";

export interface FrameV1 {
  type: "RankiFrameV1";
  chain: string;
  params: string[];
}

export const handler: RankiLangParseHandlerFunction<FrameV1> = (
  theaterRaw,
  spec,
  hooks,
) => {
  const cloned = hooks.clone([]);
  const contextV1: RankiLangAstContext = {
    hooks: cloned.hooks,
    blockDepth: spec.blockDepth,
    inlineDepth: spec.inlineDepth,
    theater: spec.theater,
    role: spec.role,
    startRule: spec.startRule,
  };

  return hooks.parseAst(theaterRaw, contextV1, cloned.hooks);
};
