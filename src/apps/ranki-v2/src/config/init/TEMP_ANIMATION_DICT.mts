import type { AnimationDict } from "_controllers/geometry/controller/animator/animator.types.mjs";
import { BADGE_LIST } from "./animation/debug/badge-list.mjs";
import { CHIP } from "./animation/debug/chip.mjs";
import { CUE_LIST } from "./animation/debug/cue-list.mjs";
import { HUD } from "./animation/debug/hud.mjs";
import { ICON } from "./animation/debug/icon.mjs";
import { TEXT } from "./animation/debug/text.mjs";

export const TEMP_ANIMATION_DICT: AnimationDict = {
  debug: {
    ...ICON,
    ...TEXT,
    ...CHIP,
    ...HUD,
    ...BADGE_LIST,
    ...CUE_LIST,
  },
};
// REMOVE

export type AnimationPack = any;
