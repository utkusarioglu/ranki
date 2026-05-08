import type { DqmParseTheater } from "@dqm/package-dqm-v2";
import type { RankiTagPrefix } from "_config/config.types.mts";

export type AnkiFlag = `flag${number}`;

export type AnkiCardType = string & { type: "AnkiCardType" };
export type AnkiCardFace = string & { type?: "AnkiCardFace" };

export type AnkiDeck = string & { type: "AnkiDeck" };
export type AnkiCard = string & { type: "AnkiCard" };
export type AnkiRawTags = string & { type: "AnkiRawTags" };
export type AnkiRawTag = string & { type: "AnkiRawTag" };

export type AnkiDeckParts = AnkiDeck[] & { type: "AnkiDeckParts" };

export type RankiScreenElement = "ranki:rule";

export type CardFace = DqmParseTheater | RankiScreenElement;

export type CardFaceArray = CardFace[];

export type AnkiMarked = boolean & { type: "AnkiMarked" };

export type AnkiNeutralTags = AnkiRawTag[];

export type RankiTag = `${RankiTagPrefix}${string}`;

export type RankiTags = RankiTag[];

export type HtmlTagOs = "windows" | "android" | "linux";
export type HtmlTagEnv = "chrome";
export type HtmlAttrDir = "ltr" | "rtl";
export type HtmlAttrTheme = "dark" | "light";

export interface AnkiTemplateFields {
  flag: AnkiFlag;
  deck: AnkiDeck;
  tags: AnkiRawTags;
  type: AnkiCardType;
  face: AnkiCardFace;
  card: AnkiCard;
}

// export type ConfigLocations = "template" | "card" | "user";

// export type CollectedConfig = Record<ConfigLocations, string>;

export interface CollectedConfigEntry {
  name: string;
  config: string;
}

export type CollectedConfig = CollectedConfigEntry[];

export type CollectedWebviewType =
  | "windows"
  | "android::old"
  | "android::new"
  | "unknown";

export type CollectedHtmlTagAttributes = {
  raw: {
    mobile: boolean;
    linux: boolean;
    android: boolean;
    chrome: boolean;
    windows: boolean;
    js: boolean;
    fancy: boolean;

    verticallyCentered: boolean;
    night_mode: boolean;
    nightMode: boolean;
    "night-mode": boolean;
    dataBsTheme: HtmlAttrTheme;
    title: string;
  };
  webview: CollectedWebviewType;
  os: HtmlTagOs;
  env: HtmlTagEnv;
  dir: HtmlAttrDir;
  scheme: HtmlAttrTheme;
};

export type RankiFaces = Record<string, HTMLDivElement>;

export interface RawFields {
  hash: string;
  htmlAttr: CollectedHtmlTagAttributes;
  fields: AnkiTemplateFields;
  faces: RankiFaces;
  config: CollectedConfig;
}

export interface FilteredTags {
  neutral: AnkiNeutralTags;
  ranki: RankiTags;
  marked: AnkiMarked;
}
