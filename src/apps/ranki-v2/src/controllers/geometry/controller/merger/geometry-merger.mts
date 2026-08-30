import type {
  CurrentAppliedStyle,
  CurrentAppliedStyleWithoutActions,
  InformContext,
  InformedChildStyle,
} from "_controllers/geometry/controller/types/geometry-controller.types.mjs";

import { GeometryEval } from "_controllers/geometry/controller/merger/geometry-eval.mjs";

import type { InformSetProps } from "../animator/types/animator.types.mjs";
import type { LayoutSizing } from "../sets/children/layout/layout-utils.types.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";

interface CreateSetItemInformerProps {
  context: InformContext;
  index: number;
  props: InformSetProps;
  sizing: LayoutSizing | null;
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
        ...informed.selfOverrides,
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
    index,
    props,
    sizing,
  }: CreateSetItemInformerProps): InformedChildStyle {
    try {
      const container: InformedChildStyle["containerExposed"] = {
        style: {
          ...(sizing ? sizing.container : {}),
          ...props.containerExposed.style,
        },
      };
      const item: InformedChildStyle["selfOverrides"] = sizing
        ? sizing.set[index]
        : // FIX I do not like this being here. sizing should be definitely available when the execution reaches here
          {
            interaction: {
              drag: "none" as const,
              focus: "none" as const,
              hover: "none" as const,
              press: "none" as const,
            },
            lifecycle: "none" as const,
            mode: "default",
            style: {},
          };
      return {
        containerExposed: container,
        context,
        selfOverrides: {
          ...item,
          style: {
            ...item.style,
            ...props.selfOverrides.style,
          },
        },
      };
    } catch (e) {
      throw new RankiAppError({
        code: "UNDEFINED",
        why: "a",
        details: {
          context,
          index,
          props,
          item: sizing?.set[index],
          sizing,
        },
        cause: e,
      });
    }
  }
}
