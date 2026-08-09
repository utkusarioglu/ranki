import type { EmitIntent, LocalAction } from "../../geometry-intent.types.mjs";
import type { WidthHeight } from "../../geometry-style.types.mjs";
import type {
  AnimationKeyframeStyles,
  InformSetProps,
} from "../animator/animator.types.mjs";
import type { EmitModes } from "../events/geometry-events.types.mjs";

export interface ComponentDims {
  intent: EmitIntent;
  mode: EmitModes;
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
  intent: EmitIntent;
  mode: EmitModes;
  style: AnimationKeyframeStyles;
};

type InformedChildStyleNode = {
  style: AnimationKeyframeStyles;
} & Pick<ComponentDims, "intent" | "mode">;
