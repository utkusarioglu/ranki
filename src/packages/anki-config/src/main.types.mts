import type { RankiLanguageUserConfig } from "@ranki/package-api";

export interface RankiAppUserConfig extends RankiLanguageUserConfig {
  version: "v2";
  anki: {
    deck: string;
    subdeck: string;
    tags: string;
    type: string;
    flag: string;
    card: string;
  };
}
