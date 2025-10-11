import type { RankiLanguageProvidedConfig } from "@ranki/package-api-v2";

export interface RankiAppUserConfig extends RankiLanguageProvidedConfig {
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
