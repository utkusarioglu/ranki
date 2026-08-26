export type AnkiDistStore = AnkiDistStoreActions & AnkiDistStoreStates;
export interface AnkiDistStoreActions {
  setAppVariant: (c: RankiAppVariant) => void;
  setCard: (c: RankiCard) => void;
  setCardConfig: (c: RankiConfigString) => void;
  setCardType: (c: RankiCardType) => void;
  setColorScheme: (s: ColorSchemes) => void;
  setContentType: (c: RankiContentType) => void;
  setDeck: (d: RankiDeckString) => void;
  setFace: (d: RankiFace) => void;
  setFlag: (d: RankiFlag) => void;
  setPreviewAspect: (n: number) => void;
  setPreviewScale: (n: number) => void;
  setTags: (t: RankiTagString) => void;
  setTemplateConfig: (c: RankiConfigString) => void;
}

export interface AnkiDistStoreStates {
  appVariant: RankiAppVariant;
  card: RankiCard;
  cardConfig: RankiConfigString;
  cardType: RankiCardType;
  colorScheme: ColorSchemes;
  contentType: RankiContentType;
  deck: RankiDeckString;
  face: RankiFace;
  flag: RankiFlag;
  previewAspect: number;
  previewScale: number;
  tags: RankiTagString;
  templateConfig: RankiConfigString;
}
export type ColorSchemes = "dark" | "light";
export type RankiAppVariant = "core" | "devtools" | "o11y";
export type RankiCard = string;

export type RankiCardType = string;
export type RankiConfigString = string;
export type RankiContentType = "foreign" | "r2";
export type RankiDeckString = string;
export type RankiFace = "N" | "Q";

export type RankiFlag = `flag${number}`;

export type RankiTagString = string;
