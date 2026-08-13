import type {
  AnimationKeyframeStyles,
  InformSetProps,
} from "../animator/types/animator.types.mjs";
// import type { ModeLibraryKey } from "../animator/types/library.types.mjs";
import type { LocalAction } from "../events/types/geometry-events.types.mjs";
// import type { EmitLifecycleKey } from "../events/types/lifecycle.types.mjs";
import type {
  EmittedComponentState,
  // GeometryInteraction,
} from "../sets/children/registry/children-registry.types.mjs";

export type ComponentDims = Required<EmittedComponentState>;

//
export type CurrentAppliedStyle = {
  actions: LocalAction[];
  container: InformedChildStyle["containerExposed"];
  self: InformedChildStyleSelf;
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

// export type InformedChildStyleSelf = {
//   interaction: GeometryInteraction;
//   lifecycle: EmitLifecycleKey;
//   mode: ModeLibraryKey;
//   style: AnimationKeyframeStyles;
// };

export type InformedChildStyleSelf = Omit<ComponentDims, "style"> & {
  style: AnimationKeyframeStyles;
};

// type InformedChildStyleSelf = {
//   style: AnimationKeyframeStyles;
// } & Omit<ComponentDims, "style">;
