import type { InformSetProps } from "../animator/animator.types.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";
import type {
  CurrentAppliedStyle,
  CurrentAppliedStyleWithoutActions,
  InformContext,
  InformedChildStyle,
} from "_controllers/geometry/controller/types/geometry-controller.types.mjs";
import { GeometryEval } from "_controllers/geometry/geometry-eval.mjs";

interface CreateSetItemInformerProps {
  context: InformContext;
  props: InformSetProps;
  sizing: LayoutSizing | null;
}

export class GeometryMerger {
  public static createSetItemInformer({
    context,
    props,
    sizing,
  }: CreateSetItemInformerProps): InformedChildStyle {
    const container: InformedChildStyle["containerExposed"] = {
      style: {
        ...(sizing ? sizing.container : {}),
        ...props.containerExposed.style,
      },
    };
    // const self: InformedChildStyle["selfOverrides"] = {
    //   style: {
    //     ...props.selfOverrides.style,
    //     // ...(sizing ? sizing.set[context.index].style : {}),
    //   },
    // };
    return {
      context,
      containerExposed: container,
      selfOverrides: props.selfOverrides,
    };
  }

  public static createCurrStyle(
    informed: InformedChildStyle,
    sizing: LayoutSizing | null,
    prev: CurrentAppliedStyle | null,
  ): CurrentAppliedStyle {
    const item = this.getItem(sizing, informed.context.index);
    const curr: CurrentAppliedStyleWithoutActions = {
      context: informed.context,
      container: {
        style: {
          ...(sizing ? sizing.container : {}),
          ...informed.containerExposed.style,
        },
      },
      self: {
        intent: item.intent,
        style: {
          ...item.style,
          ...informed.selfOverrides.style,
        },
      },
    };

    const actions = GeometryEval.evaluateActions(curr, prev);
    return { ...curr, actions };
    // return { actions, curr };
  }

  private static getItem(
    sizing: LayoutSizing | null,
    index: number,
  ): CurrentAppliedStyle["self"] {
    try {
      const item = sizing!.set[index];
      return {
        intent: item.intent,
        style: item.style,
      };
    } catch (_) {
      return {
        intent: "none" as "none",
        style: {},
      };
    }
  }
}
