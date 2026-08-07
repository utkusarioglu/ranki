import type {
  CurrentAppliedStyle,
  CurrentAppliedStyleWithoutActions,
  InformContext,
  InformedChildStyle,
} from "_controllers/geometry/controller/types/geometry-controller.types.mjs";

import { GeometryEval } from "_controllers/geometry/geometry-eval.mjs";
import { assertNotNull, assertNotUndefined } from "_error/assertions.mjs";

import type { InformSetProps } from "../animator/animator.types.mjs";
import type { LayoutSizing } from "../sets/children/layout/layout-utils.types.mjs";

interface CreateSetItemInformerProps {
  context: InformContext;
  props: InformSetProps;
  sizing: LayoutSizing | null;
}

export class GeometryMerger {
  public static createCurrStyle(
    informed: InformedChildStyle,
    sizing: LayoutSizing | null,
    prev: CurrentAppliedStyle | null,
  ): CurrentAppliedStyle {
    const item = this.getItem(sizing, informed.context.index);
    const curr: CurrentAppliedStyleWithoutActions = {
      container: {
        style: {
          ...(sizing ? sizing.container : {}),
          ...informed.containerExposed.style,
        },
      },
      context: informed.context,
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
    return {
      containerExposed: container,
      context,
      selfOverrides: props.selfOverrides,
    };
  }

  private static getItem(
    sizing: LayoutSizing | null,
    index: number,
  ): CurrentAppliedStyle["self"] {
    assertNotNull(sizing, {
      why: "Cannot create merged style without valid sizing",
    });
    const item = sizing.set[index];
    assertNotUndefined(item, {
      why: "Cannot create merged style if item size is undefined",
    });
    return {
      intent: item.intent,
      style: item.style,
    };
  }
}
