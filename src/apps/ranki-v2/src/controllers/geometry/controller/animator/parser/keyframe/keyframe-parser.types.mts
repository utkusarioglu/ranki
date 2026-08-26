import type { Value } from "expr-eval";

import type { KeyframeParser } from "./keyframe-parser.mjs";

export type KeyframeValue = number | string | undefined;

export type LegalUnitName = keyof typeof KeyframeParser.unitConversions;
export type UnitConversionsRecord = Record<
  keyof typeof KeyframeParser.UNIT_CONVERSIONS,
  (v: Value) => Value
>;
