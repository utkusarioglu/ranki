import type {
  RankiLangParseSpecs,
  RankiLangAstContext,
  RankiLangParseReport,
} from "@ranki/package-api-v2";

export interface FrameV1 {
  type: "RankiFrameV1";
  chain: string;
  params: string[];
}

export function handler(
  theaterRaw: string,
  // report: RankiLangParseReport,
  spec: RankiLangParseSpecs<FrameV1>,
  {
    lang,
    clone,
    // getComponents,
    parseAst,
  }: any,
) {
  console.log("v1!!! from handler", spec);
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
