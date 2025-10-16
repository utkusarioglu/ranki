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
  {
    lang,
    parseAst,
    // parseValidation, parseTransform
  },
) => {
  const contextV1: RankiLangAstContext = {
    lang,
    blockDepth: spec.blockDepth,
    inlineDepth: spec.inlineDepth,
    theater: spec.theater,
    role: spec.role,
    startRule: spec.startRule,
  };

  // const report: RankiLangParseReport = {
  //   language: {
  //     versions: lang.parsers.getVersions(),
  //   },
  //   // !FIX I don't like that I need to stringify the config for the yaml to appear as expected
  //   config: JSON.parse(JSON.stringify(lang.getConfig())),
  //   theater: spec.theater,
  //   role: spec.role,
  // };
  const ast = parseAst(theaterRaw, contextV1);
  return ast;
  // const validation = parseValidation(ast.root, spec);
  // const transform = parseTransform(validation, spec);
  // return {
  //   report,
  //   theaters: {
  //     [spec.theater]: {
  //       stages: {
  //         raw: theaterRaw,
  //         ast,
  //         validation,
  //         transform,
  //       },
  //     },
  //   },
  // };
};
