import type { RankiLangParseHandlerFunction } from "@ranki/package-api-v2";

export interface FrameV1 {
  type: "RankiFrameV1";
  chain: string;
  params: string[];
}

export const handler: RankiLangParseHandlerFunction = (
  theaterRaw,
  context,
  parser,
) => {
  // TODO THIS SHOULD BE USED. this handler needs to clone the language and use it
  // const cloned = context.cloneLang([]);

  const contextV1 = context.newChild("block");
  contextV1 && true;

  return {
    props: {
      message: "STILL UNDER CONSTRUCTION",
    },
    ast: parser.callback(theaterRaw),
  };
};
