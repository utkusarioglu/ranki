import type { R2C } from "_components/r2c/r2c.mjs";
import type { ReconciliationDiff } from "_controllers/reconciler/utils.types.mjs";

import type { InformSetProps } from "../animator/types/animator.types.mjs";
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
      selfOverrides: geo.set[0],
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
      index: i,
      props,
      sizing,
    });
    return informed;
  }
}
