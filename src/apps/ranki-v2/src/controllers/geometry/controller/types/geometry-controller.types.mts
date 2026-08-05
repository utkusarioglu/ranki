import type {
  AnimationKeyframeStyles,
  InformSetProps,
} from "../animator/animator.types.mjs";
import type { EmitModes } from "../events/geometry-events.types.mjs";
import type {
  EmitIntent,
  LocalAction,
  WithEmitIntents,
} from "../../geometry-intent.types.mjs";
import type { WidthHeight } from "../../geometry-style.types.mjs";

export type GeometrySetName = string & { type?: "GeometrySet" };

export interface OnEmitParams {
  set: GeometrySetName;
}

export type GeometryControllerInformSetCb = (
  params: InformSetProps,
) => Promise<void>;

export interface ComponentDims {
  intent: EmitIntent;
  mode?: EmitModes;
  style: WidthHeight;
}

type InformedChildStyleNode = Pick<ComponentDims, "intent" | "mode"> & {
  style: AnimationKeyframeStyles;
};

export type InformedChildStyleContainer = {
  style: AnimationKeyframeStyles;
};

export type InformedChildStyleSelf = {
  style: AnimationKeyframeStyles;
};

export type InformedChildStyle = Pick<
  InformSetProps,
  "containerExposed" | "selfOverrides"
> & {
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
