import type {
  DqmParseInputStructured,
  DqmParseTheater,
  IDqmRendererClientPreferences,
} from "@dqm/package-dqm-v2";
import { RANKI_TAG_INDICATOR } from "../selector.constants.mjs";
import type { HudProps } from "../components/card-hud/hud.types.mjs";

export type AnkiFlag = `flag${number}`;

export type AnkiCardType = string & { type: "AnkiCardType" };
export type AnkiCardFace = string & { type: "AnkiCardFace" };

export type AnkiDeck = string & { type: "AnkiDeck" };
export type AnkiRawTags = string & { type: "AnkiRawTags" };
export type AnkiRawTag = string & { type: "AnkiRawTag" };

export type AnkiDeckParts = AnkiDeck[] & { type: "AnkiDeckParts" };

export type CardFace = DqmParseTheater;

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
}

export interface DataCollection {
  raw: {
    html: {
      mode: HtmlTagMode;
      os: HtmlTagOs;
      env: HtmlTagEnv;
      dir: HtmlAttrDir;
      dataBsTheme: HtmlAttrTheme;
    };
    fields: AnkiTemplateFields;
  };
  hud: HudProps;
  pref: IDqmRendererClientPreferences;
  inputs: DqmParseInputStructured;
  theaterOrder: CardFaceArray;
  address: AnkiDeckParts;
  marked: AnkiMarked;
  neutralTags: AnkiNeutralTags;
  rankiTags: RankiTags;
}
