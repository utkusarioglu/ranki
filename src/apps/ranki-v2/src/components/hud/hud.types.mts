import type {
  AnkiCard,
  AnkiCardFace,
  AnkiCardType,
} from "../../collect/collect.types.mjs";

export type HudComponentNames =
  | "parser"
  | "address"
  | "tags"
  | "review"
  | "card";

export interface HudProps {
  order: HudComponentNames[];
  parser: {
    hasReplacements: boolean;
    parseMode: "v1" | "v2" | "ignored";
    errorLevel: "none" | "warning" | "error";
  };
  address: {
    prefix: string[];
    exposed: string[];
    suffix: string[];
  };
  tags: string[];
  review: {
    marked: boolean;
    flag: {
      type: `flag${number}`;
      message: string;
    };
  };
  card: {
    type: AnkiCardType;
    face: AnkiCardFace;
    card: AnkiCard;
  };
}
