import type {
  GeometryInteractionKey,
  GeometryInteractionLibraryState,
} from "../../sets/children/registry/children-registry.types.mjs";
import type { AnimationBlock } from "./animator.types.mjs";

export type GeometryAnimationPresetName = string & {
  type?: "GeometryAnimationPresetName";
};

export type GeometryAnimationPresetDict = Record<
  GeometryAnimationPresetName,
  GeometryAnimationPreset
>;

export type GeometryRoleName = string & { type?: "GeometryRoleName" };

export type GeometryAnimationPreset = Record<
  GeometryRoleName,
  RoleAnimationDict
>;

export type ModeLibraryKey = string & { type?: "ModeLibraryKey" };

type RoleInteractionDict = Record<
  GeometryInteractionLibraryState,
  AnimationBlock
>;

type RoleInteractionsDict = Record<GeometryInteractionKey, RoleInteractionDict>;
type RoleInteractionsDictPartial = Partial<RoleInteractionsDict>;

interface RoleLifecycleDict {
  enter: AnimationBlock;
  update?: AnimationBlock;
  leave: AnimationBlock;
}

interface ModeLifecycleDict {
  enter: AnimationBlock;
  leave: AnimationBlock;
}

interface RoleAnimationDict {
  lifecycle: RoleLifecycleDict;
  interaction?: RoleInteractionsDictPartial;
  mode?: Record<ModeLibraryKey, ModeLifecycleDict>;
}
