import type {
  CurrentAppliedStyle,
  CurrentAppliedStyleWithoutActions,
  InformContext,
  InformedChildStyle,
} from "_controllers/geometry/controller/types/geometry-controller.types.mjs";

import { GeometryEval } from "_controllers/geometry/controller/merger/geometry-eval.mjs";

import type { InformSetProps } from "../animator/animator.types.mjs";
import type { LayoutSizing } from "../sets/children/layout/layout-utils.types.mjs";

interface CreateSetItemInformerProps {
  context: InformContext;
  props: InformSetProps;
  sizing: LayoutSizing | null;
  index: number;
}

export class GeometryMerger {
  public static createCurrStyle(
    informed: InformedChildStyle,
    sizing: LayoutSizing | null,
    prev: CurrentAppliedStyle | null,
  ): CurrentAppliedStyle {
    // const item = this.getItem(sizing, informed.context.index);
    const curr: CurrentAppliedStyleWithoutActions = {
      container: {
        style: {
          ...informed.containerExposed.style,
        },
      },
      context: informed.context,
      self: {
        intent: informed.selfOverrides.intent,
        mode: informed.selfOverrides.mode,
        // intent: item.intent,
        // intent: "enter",
        style: {
          ...(sizing ? sizing.container : {}),
          // ...item.style,
          ...informed.selfOverrides.style,
        },
      },
    };

    const actions = GeometryEval.evaluateActions(curr, prev);
    return { ...curr, actions };
  }

  public static createSetItemInformer({
    context,
    props,
    sizing,
    index,
  }: CreateSetItemInformerProps): InformedChildStyle {
    const container: InformedChildStyle["containerExposed"] = {
      style: {
        ...(sizing ? sizing.container : {}),
        ...props.containerExposed.style,
      },
    };
    const item = sizing
      ? sizing.set[index]
      : // FIX I do not like this being here. sizing should be definitely available when the execution reaches here
        {
          intent: "none" as const,
          mode: "idle" as const,
          style: {},
        };
    return {
      containerExposed: container,
      context,
      selfOverrides: {
        intent: item.intent,
        mode: item.mode,
        style: {
          ...item.style,
          ...props.selfOverrides.style,
        },
      },
    };
  }

  // private static getItem(
  //   sizing: LayoutSizing | null,
  //   index: number,
  // ): CurrentAppliedStyle["self"] {
  //   const empty = {
  //     intent: "none" as const,
  //     style: { width: 0, height: 0, top: 0, left: 0 },
  //   };
  //   if (!sizing) return empty;
  //   const item = sizing.set[index];
  //   if (!item) return empty;

  //   // assertNotNull(sizing, {
  //   //   why: "Cannot create merged style without valid sizing",
  //   // });
  //   // const item = sizing.set[index];
  //   // assertNotUndefined(item, {
  //   //   why: "Cannot create merged style if item size is undefined",
  //   // });
  //   return {
  //     intent: item.intent,
  //     style: item.style,
  //   };
  // }
}
