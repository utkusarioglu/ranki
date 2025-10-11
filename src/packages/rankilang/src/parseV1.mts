import type {
  RankiLangParseSpecsFrameV1,
  RankiLangAstContext,
  RankiLangParseReport,
} from "@ranki/package-api";

export function parseV1(
  theaterRaw: string,
  // report: RankiLangParseReport,
  spec: RankiLangParseSpecsFrameV1,
  {
    lang,
    clone,
    // getComponents,
    parseAst,
  }: any,
) {
  console.log("v1!!!", spec);
  const contextV1: RankiLangAstContext = {
    lang,
    blockDepth: spec.blockDepth,
    inlineDepth: spec.inlineDepth,
    theater: spec.theater,
    role: spec.role,
    startRule: spec.startRule,
  };

  const report: RankiLangParseReport = {
    language: {
      versions: lang.parsers.getVersions(),
    },
    // !FIX I don't like that I need to stringify the config for the yaml to appear as expected
    config: JSON.parse(JSON.stringify(lang.getConfig())),
    theater: spec.theater,
    role: spec.role,
  };
  return {
    report,
    theaters: {
      [spec.theater]: {
        stages: {
          raw: theaterRaw,
          ast: parseAst(contextV1, theaterRaw),
        },
      },
    },
  };
}
