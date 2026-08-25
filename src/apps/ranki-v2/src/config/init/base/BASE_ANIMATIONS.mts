import type { GeometryAnimationPresetDict } from "_controllers/geometry/controller/animator/types/library.types.mjs";
import { BADGE_LIST } from "./animations/debug/BADGE_LIST.mjs";
import { CHIP } from "./animations/debug/CHIP.mjs";
import { CUE_LIST } from "./animations/debug/CUE_LIST.mjs";
import { HUD } from "./animations/debug/HUD.mjs";
import { ICON } from "./animations/debug/ICON.mjs";
import { TEXT } from "./animations/debug/TEXT.mjs";

export const BASE_ANIMATIONS: GeometryAnimationPresetDict = {
  debug: {
    ...ICON,
    ...TEXT,
    ...CHIP,
    ...HUD,
    ...BADGE_LIST,
    ...CUE_LIST,
  },
};
