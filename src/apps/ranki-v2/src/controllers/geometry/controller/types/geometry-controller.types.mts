import type {
  AnimationKeyframeStyles,
  InformSetProps,
} from "../animator/animator.types.mts";
import type { EmitModes } from "../../events/geometry-events.types.mts";
import type {
  EmitIntent,
  LocalAction,
  WithEmitIntents,
} from "../../geometry-intent.types.mts";
import type { WidthHeight } from "../../geometry-style.types.mts";

export type GeometrySetName = string & { type?: "GeometrySet" };

export interface OnEmitParams {
  set: GeometrySetName;
}

export type GeometryControllerInformTargetCb = (
  params: InformSetProps,
) => Promise<void>;

export interface ComponentDims {
  intent: EmitIntent;
  mode?: EmitModes;
  style: WidthHeight;
}

type InformedChildStyleNode = Pick<ComponentDims, "intent" | "mode"> & {
  // intent: EmitIntent;
  style: AnimationKeyframeStyles;
};

export type InformedChildStyleContainer = {
  // intent: EmitIntent;
  style: AnimationKeyframeStyles;
};

export type InformedChildStyleSelf = {
  // intent: EmitIntent;
  style: AnimationKeyframeStyles;
};

export type InformedChildStyle = Pick<
  InformSetProps,
  "containerExposed" | "selfOverrides"
> & {
  // containerExposed: InformedChildStyleContainer;
  // selfOverrides: InformedChildStyleSelf;
  // item: InformedChildStyleNode;
  context: InformContext;
};
export type CurrentAppliedStyleWithoutActions = Omit<
  CurrentAppliedStyle,
  "actions"
>;
export type CurrentAppliedStyle = Omit<
  InformedChildStyle,
  "selfOverrides" | "containerExposed"
> & {
  actions: LocalAction[];
  self: InformedChildStyleNode;
  container: InformedChildStyle["containerExposed"];
};

export type UpdateStyle = AnimationKeyframeStyles & WithEmitIntents;

export type InformContext = {
  index: number;
  length: number;
  stagger: number;
};
