import type {
  AnimationKeyframeStyles,
  InformSetProps,
} from "./animator/animator.types.mts";
import type { EmitModes } from "../events/geometry-events.types.mts";
import type {
  EmitIntent,
  LocalAction,
  WithEmitIntents,
} from "../geometry-intent.types.mts";
import type { WidthHeight } from "../geometry-style.types.mts";

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

export type InformedChildStyle = {
  container: InformedChildStyleContainer;
  // item: InformedChildStyleNode;
  context: InformContext;
};
export type CurrentAppliedStyleWithoutActions = Omit<
  CurrentAppliedStyle,
  "actions"
>;
export type CurrentAppliedStyle = InformedChildStyle & {
  actions: LocalAction[];
  item: InformedChildStyleNode;
};

export type UpdateStyle = AnimationKeyframeStyles & WithEmitIntents;

export type InformContext = {
  index: number;
  length: number;
  stagger: number;
};
