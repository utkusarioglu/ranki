import type { RankiTagPrefix } from "_config/config.types.mjs";
import type { DqmParseTheater } from "@dqm/package-dqm-v2";

export type AnkiCard = { type: "AnkiCard" } & string;

export type AnkiCardFace = { type?: "AnkiCardFace" } & string;
export type AnkiCardType = { type: "AnkiCardType" } & string;

export type AnkiDeck = { type: "AnkiDeck" } & string;
export type AnkiDeckParts = { type: "AnkiDeckParts" } & AnkiDeck[];
export type AnkiFlag = `flag${number}`;
export type AnkiMarked = { type: "AnkiMarked" } & boolean;

export type AnkiNeutralTags = AnkiRawTag[];

export type AnkiRawTag = { type: "AnkiRawTag" } & string;

export type AnkiRawTags = { type: "AnkiRawTags" } & string;

export interface AnkiTemplateFields {
  card: AnkiCard;
  deck: AnkiDeck;
  face: AnkiCardFace;
  flag: AnkiFlag;
  tags: AnkiRawTags;
  type: AnkiCardType;
}

export type CardFace = DqmParseTheater | RankiScreenElement;

export type CardFaceArray = CardFace[];

export type CollectedConfig = CollectedConfigEntry[];

export interface CollectedConfigEntry {
  config: string;
  name: string;
}

export type CollectedHtmlTagAttributes = {
  dir: HtmlAttrDir;
  env: HtmlTagEnv;
  os: HtmlTagOs;
  raw: {
    android: boolean;
    chrome: boolean;
    // dataBsTheme: HtmlAttrTheme;
    fancy: boolean;
    js: boolean;
    linux: boolean;
    mobile: boolean;

    night_mode: boolean;
    "night-mode": boolean;
    nightMode: boolean;
    title: string;
    verticallyCentered: boolean;
    windows: boolean;
  };
  scheme: HtmlAttrTheme;
  webview: CollectedWebviewType;
};
export type CollectedWebviewType =
  | "android::new"
  | "android::old"
  | "unknown"
  | "windows";
export interface FilteredTags {
  marked: AnkiMarked;
  neutral: AnkiNeutralTags;
  ranki: RankiTags;
}
export type HtmlAttrDir = "ltr" | "rtl";

export type HtmlAttrTheme = "dark" | "light";

// export type ConfigLocations = "template" | "card" | "user";

// export type CollectedConfig = Record<ConfigLocations, string>;

export type HtmlTagEnv = "chrome";

export type HtmlTagOs = "android" | "linux" | "windows";

export type RankiFaces = Record<string, HTMLDivElement>;

export type RankiScreenElement = "ranki:rule";

export type RankiTag = `${RankiTagPrefix}${string}`;

export type RankiTags = RankiTag[];

export interface RawFields {
  config: CollectedConfig;
  faces: RankiFaces;
  fields: AnkiTemplateFields;
  hash: string;
  htmlAttr: CollectedHtmlTagAttributes;
}
