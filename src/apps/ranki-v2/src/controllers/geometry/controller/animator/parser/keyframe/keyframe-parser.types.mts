import type { KeyframeParser } from "./keyframe-parser.mjs";

export type LegalUnitName = keyof typeof KeyframeParser.unitConversions;
export type UnitConversions = Record<
  keyof typeof KeyframeParser.UNIT_CONVERSIONS,
  (v: number) => number
>;
