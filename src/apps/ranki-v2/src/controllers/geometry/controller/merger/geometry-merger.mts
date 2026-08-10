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
  ): CurrentAppliedStyle {
    const curr: CurrentAppliedStyleWithoutActions = {
      container: {
        style: {
          ...informed.containerExposed.style,
        },
      },
      context: informed.context,
      self: {
        lifecycle: informed.selfOverrides.lifecycle,
        interaction: informed.selfOverrides.interaction,
        style: {
          ...(sizing ? sizing.container : {}),
          ...informed.selfOverrides.style,
        },
      },
    };

    const actions = GeometryEval.evaluateActions(curr);
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
          lifecycle: "none" as const,
          interaction: {
            hover: "none" as const,
            drag: "none" as const,
            press: "none" as const,
            focus: "none" as const,
          },
          style: {},
        };
    return {
      containerExposed: container,
      context,
      selfOverrides: {
        lifecycle: item.lifecycle,
        interaction: item.interaction,
        style: {
          ...item.style,
          ...props.selfOverrides.style,
        },
      },
    };
  }
}
