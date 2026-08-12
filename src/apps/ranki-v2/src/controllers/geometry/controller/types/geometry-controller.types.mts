import type {
  AnimationKeyframeStyles,
  InformSetProps,
} from "../animator/types/animator.types.mjs";
import type { LocalAction } from "../events/types/geometry-events.types.mjs";
import type { EmitLifecycleKey } from "../events/types/lifecycle.types.mjs";
import type { GeometryInteraction } from "../sets/children/registry/children-registry.types.mjs";
import type { WidthHeight } from "./geometry-style.types.mjs";

export interface ComponentDims {
  interaction: GeometryInteraction;
  lifecycle: EmitLifecycleKey;
  style: WidthHeight;
}

//
export type CurrentAppliedStyle = {
  actions: LocalAction[];
  container: InformedChildStyle["containerExposed"];
  self: InformedChildStyleNode;
} & Omit<InformedChildStyle, "containerExposed" | "selfOverrides">;

export type CurrentAppliedStyleWithoutActions = Omit<
  CurrentAppliedStyle,
  "actions"
>;

export type GeometryControllerInformSetCb = (
  params: InformSetProps,
) => Promise<void>;

export type InformContext = {
  index: number;
  length: number;
  stagger: number;
};

export type InformedChildStyle = {
  context: InformContext;
} & Pick<InformSetProps, "containerExposed" | "selfOverrides">;

export type InformedChildStyleContainer = {
  style: AnimationKeyframeStyles;
};

export type InformedChildStyleSelf = {
  interaction: GeometryInteraction;
  lifecycle: EmitLifecycleKey;
  style: AnimationKeyframeStyles;
};

type InformedChildStyleNode = {
  style: AnimationKeyframeStyles;
} & Pick<ComponentDims, "interaction" | "lifecycle">;
