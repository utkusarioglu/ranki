import type { DqmParseTheater } from "@dqm/package-dqm-v2";
import { RANKI_TAG_INDICATOR } from "../selector.constants.mjs";

export type AnkiFlag = `flag${number}`;

export type AnkiCardType = string & { type: "AnkiCardType" };
export type AnkiCardFace = string & { type: "AnkiCardFace" };

export type AnkiDeck = string & { type: "AnkiDeck" };
export type AnkiCard = string & { type: "AnkiCard" };
export type AnkiRawTags = string & { type: "AnkiRawTags" };
export type AnkiRawTag = string & { type: "AnkiRawTag" };

export type AnkiDeckParts = AnkiDeck[] & { type: "AnkiDeckParts" };

export type RankiScreenElement = "ranki:hr" | "ranki:vr";

export type CardFace = DqmParseTheater | RankiScreenElement;

export type CardFaceArray = CardFace[];

export type AnkiMarked = boolean & { type: "AnkiMarked" };

export type AnkiNeutralTags = AnkiRawTag[];

export type RankiTag = `${typeof RANKI_TAG_INDICATOR}${string}`;

export type RankiTags = RankiTag[];

export type HtmlTagClassCollection = [HtmlTagMode, HtmlTagOs, HtmlTagEnv];

export type HtmlTagMode = "night-mode" | "day-mode";
export type HtmlTagOs = "win" | "android";
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

export type ConfigLocations = "template" | "card" | "user";

export type CollectedConfig = Record<ConfigLocations, string>;

export type CollectedHtmlTagAttributes = {
  mode: HtmlTagMode;
  os: HtmlTagOs;
  env: HtmlTagEnv;
  dir: HtmlAttrDir;
  dataBsTheme: HtmlAttrTheme;
};

export type RankiFaces = Record<string, HTMLDivElement>;

export interface DataCollection {
  htmlAttr: CollectedHtmlTagAttributes;
  fields: AnkiTemplateFields;
  faces: RankiFaces;
  address: AnkiDeckParts;
  config: CollectedConfig;
}

export interface FilteredTags {
  neutral: AnkiNeutralTags;
  ranki: RankiTags;
  marked: AnkiMarked;
}
