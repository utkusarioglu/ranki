import type {
  EmitLifecycle,
  LocalAction,
} from "../../geometry-intent.types.mjs";
import type { WidthHeight } from "../../geometry-style.types.mjs";
import type {
  AnimationKeyframeStyles,
  InformSetProps,
} from "../animator/animator.types.mjs";
import type { GeometryInteraction } from "../sets/children/registry/children-registry.types.mjs";

export interface ComponentDims {
  lifecycle: EmitLifecycle;
  interaction: GeometryInteraction;
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
  lifecycle: EmitLifecycle;
  interaction: GeometryInteraction;
  style: AnimationKeyframeStyles;
};

type InformedChildStyleNode = {
  style: AnimationKeyframeStyles;
} & Pick<ComponentDims, "lifecycle" | "interaction">;
