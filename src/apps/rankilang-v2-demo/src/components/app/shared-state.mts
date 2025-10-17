import type { RankiLanguageMergedConfig } from "@ranki/package-api-v2";

export type SharedState =
  | null
  | {
      type: "loaded";
      parsed: object;
      config: RankiLanguageMergedConfig;
    }
  | {
      type: "error";
      error: string;
    };
