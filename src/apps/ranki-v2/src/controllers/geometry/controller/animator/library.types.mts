import type { LocalAction } from "../events/types/geometry-events.types.mjs";
import type { AnimationBlock } from "./animator.types.mjs";

export type GeometryRoleName = string & { type?: "GeometryRoleName" };

export type GeometryAnimationPreset = Record<
  GeometryRoleName,
  RoleAnimationDict
>;
type RoleAnimationDict = Partial<Record<LocalAction, AnimationBlock>>;

export type GeometryAnimationPresetDict = Record<
  GeometryAnimationPresetName,
  GeometryAnimationPreset
>;

export type GeometryAnimationPresetName = string & {
  type?: "GeometryAnimationPresetName";
};
