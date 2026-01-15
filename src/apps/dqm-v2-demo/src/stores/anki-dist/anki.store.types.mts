export type AnkiDistStore = AnkiDistStoreStates & AnkiDistStoreActions;
export type ColorSchemes = "dark" | "light";

export type RankiConfigString = string;
export type RankiTagString = string;
export type RankiDeckString = string;
export type RankiFlag = `flag${number}`;

export type RankiFace = "Q" | "N";
export type RankiCardType = string;
export interface AnkiDistStoreStates {
  previewAspect: number;
  previewScale: number;
  colorScheme: ColorSchemes;
  cardConfig: RankiConfigString;
  templateConfig: RankiConfigString;
  tags: RankiTagString;
  deck: RankiDeckString;
  flag: RankiFlag;
  face: RankiFace;
  cardType: RankiCardType;
}

export interface AnkiDistStoreActions {
  setPreviewScale: (n: number) => void;
  setPreviewAspect: (n: number) => void;
  setColorScheme: (s: ColorSchemes) => void;
  setCardConfig: (c: RankiConfigString) => void;
  setTemplateConfig: (c: RankiConfigString) => void;
  setTags: (t: RankiTagString) => void;
  setDeck: (d: RankiDeckString) => void;
  setFlag: (d: RankiFlag) => void;
  setFace: (d: RankiFace) => void;
  setCardType: (c: RankiCardType) => void;
}
