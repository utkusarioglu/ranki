import type { R2C } from "_components/r2c/r2c.mjs";
import type { InformSetProps } from "../animator/animator.types.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";
import type {
  CurrentAppliedStyle,
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
    sizing: LayoutSizing,
    diff: ReconciliationDiff,
  ): InformedChildStyle {
    const context: InformContext = {
      index: i,
      length: a.length,
      stagger: diff.stagger.indices[i],
    };
    const item = sizing.set[i];
    const containerS: InformedChildStyle["container"] = {
      style: {
        // ...item.style
        ...sizing.container,
        ...props.container.style,
      },
    };
    const informed = { context, container: containerS, item };
    return informed;
  }

  public static createCurrStyle(
    sizing: LayoutSizing,
    informed: InformedChildStyle,
    prev: InformedChildStyle | null,
  ): CurrentAppliedStyle {
    const item = sizing ? sizing.set[informed.context.index] : null;
    const curr: InformedChildStyle = {
      context: informed.context,
      container: {
        // intent: informed.container.intent,
        style: {
          ...(sizing ? sizing.container : {}),
          ...informed.container.style,
        },
      },
      item: {
        intent: informed.item.intent,
        style: {
          ...(item ? item.style : {}),
          ...informed.item.style,
        },
      },
    };

    const actions = GeometryEval.evaluateActions(curr, prev);
    return { ...curr, actions };
    // return { actions, curr };
  }
}
