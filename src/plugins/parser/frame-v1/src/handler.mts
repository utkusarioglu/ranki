import type {
  RankiLangAstContext,
  RankiLangParseHandlerFunction,
} from "@ranki/package-api-v2";

export interface FrameV1 {
  type: "RankiFrameV1";
  chain: string;
  params: string[];
}

export const handler: RankiLangParseHandlerFunction<FrameV1> = (
  theaterRaw,
  context,
) => {
  const cloned = context.hooks.clone([]);
  const contextV1: RankiLangAstContext = {
    plugin: context.plugin,
    hooks: cloned.hooks,
    blockDepth: context.blockDepth + 1,
    inlineDepth: context.inlineDepth,
    theater: context.theater,
    role: context.role,
    startRule: context.startRule,
  };

  const parseAst = context.hooks.createAstParser(contextV1);

  return parseAst(theaterRaw);
};
