import type {
  AnkiCard,
  AnkiCardFace,
  AnkiCardType,
  AnkiRawTag,
  RankiTag,
} from "../../config/collect/collect.types.mts";
import type { CueRecord } from "../../config/config.types.mts";

export type HudComponentNames = "parser" | "address" | "tags" | "cues" | "card";

export type HudVisibility = "visible" | "pull" | "pullWhenShort";

export interface HudProps {
  order: HudComponentNames[];
  visibility: HudVisibility;
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
  tags: {
    count: number;
    neutral: AnkiRawTag[];
    ranki: RankiTag[];
    hideRanki: boolean;
  };
  cues: CueRecord[];
  card: {
    type: AnkiCardType;
    face: AnkiCardFace;
    card: AnkiCard;
  };
}
