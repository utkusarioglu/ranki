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
  // TODO THIS SHOULD BE USED. this handler needs to clone the language and use it
  const cloned = context.cloneLang([]);
  // const contextV1: RankiLangAstContext = {
  //   parser: context.parser,
  //   astHash: "",
  //   hooks: cloned.hooks,
  //   blockDepth: context.blockDepth + 1,
  //   inlineDepth: context.inlineDepth,
  //   theater: context.theater,
  //   role: context.role,
  //   startRule: context.startRule,
  // };

  const contextV1 = context.cloneContext("block");

  return context.parseAst(theaterRaw, contextV1);
};
