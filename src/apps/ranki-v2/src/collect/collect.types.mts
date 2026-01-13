import type {
  DqmParseInputStructured,
  DqmParseTheater,
  IDqmRendererClientPreferences,
} from "@dqm/package-dqm-v2";
import { RANKI_TAG_INDICATOR } from "./collect.constants.mts";

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

export interface DataCollection {
  data: {
    flag: AnkiFlag;
    deck: AnkiDeck;
    tags: AnkiRawTags;
    type: AnkiCardType;
    face: AnkiCardFace;
  };
  pref: IDqmRendererClientPreferences
  inputs: DqmParseInputStructured;
  selectedFaces: CardFaceArray;
  address: AnkiDeckParts;
  marked: AnkiMarked;
  neutralTags: AnkiNeutralTags;
  rankiTags: RankiTags;
}
