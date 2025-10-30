import type { RankiLangParseHandlerFunction } from "@ranki/package-api-v2";

export const handler: RankiLangParseHandlerFunction = (
  theaterRaw,
  context,
  parser,
) => {
  const config = context.getMergedConfig();
  const theaterWithContent = [
    config.content.prefix,
    theaterRaw,
    config.content.suffix,
  ].join("");

  return {
    props: {
      message: "STILL UNDER CONSTRUCTION",
    },
    ast: parser.callback(theaterWithContent),
  };
};
