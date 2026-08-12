import type { LocalAction } from "../../events/types/geometry-events.types.mjs";
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

type RoleAnimationDict = Partial<Record<LocalAction, AnimationBlock>>;

export type ModeLibraryKey = string & { type?: "ModeLibraryKey" };

type RoleInteractionDict = Record<
  GeometryInteractionLibraryState,
  AnimationBlock
>;

type RoleInteractionsDict = Record<GeometryInteractionKey, RoleInteractionDict>;

interface RoleLifecycleDict {
  enter: AnimationBlock;
  update: AnimationBlock;
  leave: AnimationBlock;
}

interface ModeLifecycleDict {
  enter: AnimationBlock;
  leave: AnimationBlock;
}

interface RoleAnimationDict_NEW {
  lifecycle: RoleLifecycleDict;
  interaction: RoleInteractionsDict;
  mode: Record<ModeLibraryKey, ModeLifecycleDict>;
}
