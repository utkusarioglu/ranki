import type { R2C } from "_components/r2c/r2c.mjs";
import type { InformSetProps } from "../animator/animator.types.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";
import type {
  CurrentAppliedStyle,
  CurrentAppliedStyleWithoutActions,
  InformContext,
  InformedChildStyle,
} from "_controllers/geometry/controller/geometry-controller.types.mjs";
import type { ReconciliationDiff } from "_utils/reconciliation.utils.mjs";
import { GeometryEval } from "_controllers/geometry/geometry-eval.mjs";

export class GeometryMerger {
  public static createSetItemInformer(
    i: number,
    a: R2C[],
    props: InformSetProps,
    sizing: LayoutSizing | null,
    diff: ReconciliationDiff,
  ): InformedChildStyle {
    const context: InformContext = {
      index: i,
      length: a.length,
      stagger: diff.stagger.indices[i],
    };
    // const item = sizing ? sizing.set[i] : {style: {}};
    const container: InformedChildStyle["container"] = {
      style: {
        // ...item.style
        ...(sizing ? sizing.container : {}),
        ...props.container.style,
      },
    };
    return { context, container };
  }

  public static createCurrStyle(
    informed: InformedChildStyle,
    sizing: LayoutSizing | null,
    prev: CurrentAppliedStyle | null,
  ): CurrentAppliedStyle {
    // const item = sizing.set[informed.context.index];
    const item = this.getItem(sizing, informed.context.index);
    const curr: CurrentAppliedStyleWithoutActions = {
      context: informed.context,
      container: {
        // intent: informed.container.intent,
        style: {
          ...(sizing ? sizing.container : {}),
          ...informed.container.style,
        },
      },
      item: {
        intent: item.intent,
        style: {
          ...item.style,
          // ...(item ? item.style : {}),
          // ...informed.item.style,
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
  ): CurrentAppliedStyle["item"] {
    try {
      const item = sizing!.set[index];
      return {
        intent: item.intent,
        style: item.style,
      };
    } catch (_) {
      console.log("s", sizing, index);
      return {
        intent: "none" as "none",
        style: {},
      };
    }
  }
}
