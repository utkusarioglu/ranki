import type {
  RankiLangParseResult,
  RankiLanguageMergedConfig,
} from "@ranki/package-api-v2";

export type SharedState =
  | null
  | {
      type: "loaded";
      parsed: RankiLangParseResult;
      config: RankiLanguageMergedConfig;
      astNodeSelectedProps: string[];
      validationNodeSelectedProps: string[];
      transformNodeSelectedProps: string[];
    }
  | {
      type: "error";
      error: string;
    };
