import type { R2C } from "_components/r2c/r2c.mjs";
import type { ReconciliationDiff } from "_utils/reconciliation.utils.mjs";

import type { InformSetProps } from "../animator/animator.types.mjs";
import type {
  InformContext,
  InformedChildStyle,
} from "../types/geometry-controller.types.mjs";
import type { LayoutSizing } from "./children/layout/layout-utils.types.mjs";

import { GeometryMerger } from "../merger/geometry-merger.mjs";

export class GeometrySetsUtils {
  public static prepareRootStyle(geo: LayoutSizing): InformedChildStyle {
    const inform: InformedChildStyle = {
      containerExposed: {
        style: geo.container,
      },
      context: {
        index: 0,
        length: 1,
        stagger: 0,
      },
      selfOverrides: {
        intent: "none",
        style: {},
      },
    };
    return inform;
  }

  public static prepareSetElementStyle(
    i: number,
    a: R2C[],
    diff: ReconciliationDiff,
    props: InformSetProps,
    sizing: LayoutSizing | null,
  ): InformedChildStyle {
    const context: InformContext = {
      index: i,
      length: a.length,
      stagger: diff.stagger.indices[i],
    };
    const informed = GeometryMerger.createSetItemInformer({
      context,
      props,
      sizing,
      index: i,
    });
    return informed;
  }
}
