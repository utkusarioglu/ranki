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
    }
  | {
      type: "error";
      error: string;
    };
