import type { ModeAnimationTypes } from "../../events/types/mode.types.mjs";
import type {
  GeometryInteractionKey,
  GeometryInteractionLibraryState,
} from "../../sets/children/registry/children-registry.types.mjs";
import type { AnimationBlock } from "./animator.types.mjs";

export type GeometryAnimationPreset = Record<
  GeometryRoleName,
  RoleAnimationDict
>;

export type GeometryAnimationPresetDict = Record<
  GeometryAnimationPresetName,
  GeometryAnimationPreset
>;

export type GeometryAnimationPresetName = {
  type?: "GeometryAnimationPresetName";
} & string;

export type GeometryRoleName = { type?: "GeometryRoleName" } & string;

export type ModeLibraryKey = { type?: "ModeLibraryKey" } & string;

type ModeLifecycleDict = Record<ModeAnimationTypes, AnimationBlock>;

interface RoleAnimationDict {
  interaction?: RoleInteractionsDictPartial;
  lifecycle: RoleLifecycleDict;
  mode?: Record<ModeLibraryKey, ModeLifecycleDict>;
}
type RoleInteractionDict = Record<
  GeometryInteractionLibraryState,
  AnimationBlock
>;

type RoleInteractionsDict = Record<GeometryInteractionKey, RoleInteractionDict>;

type RoleInteractionsDictPartial = Partial<RoleInteractionsDict>;

interface RoleLifecycleDict {
  enter: AnimationBlock;
  leave: AnimationBlock;
  update?: AnimationBlock;
}
