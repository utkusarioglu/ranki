import type { RankiLangParseHandlerFunction } from "@ranki/package-api-v2";
import { parseSettings } from "./params.mjs";

export const handler: RankiLangParseHandlerFunction = (
  theaterRaw,
  context,
  parser,
) => {
  const parserDef = parser.expandedDefinition;
  if (parserDef.type !== "RankiFrameV2") {
    throw new Error(`FRAME V2 HANDLER GIVEN NON-FRAME V2 COMPONENT`);
  }
  if (parserDef.chain.length > 1) {
    throw new Error(`MULTI-LENGTH CHAINS NOT YET SUPPORTED`);
  }
  const component = context.getComponent("RankiFrameV2", parserDef.chain[0]);

  const { directives, settings } = parseSettings(
    component.stages.ast.params,
    context,
  );

  const cloned = context.cloneLang([
    {
      plugins: {
        standards: null,
        requested: null,
      },
    },
    component.stages.ast.directives,
    directives,
  ]);
  // const contextV2 = context.newChild("block");
  // const contextV2Old: RankiLangAstContext = {
  //   parser: context.parser,
  //   astHash: "",
  //   hooks: cloned.hooks,
  //   blockDepth: context.blockDepth + 1,
  //   inlineDepth: context.inlineDepth,
  //   theater: context.theater,
  //   role: context.role,
  //   startRule: context.startRule,
  // };

  const merged = cloned.hooks.getConfig().merged;
  const contentConfig = merged.content;
  console.log({ merged });

  const theaterWithContent = [
    contentConfig.prefix,
    component.stages.preprocess(theaterRaw),
    contentConfig.suffix,
  ].join("");

  return {
    props: {
      settings,
      directives,
    },
    ast: parser.callback(theaterWithContent),
  };
};
