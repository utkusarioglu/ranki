import type { R2C } from "_components/r2c/r2c.mjs";
import type { ReconciliationDiff } from "_utils/reconciliation.utils.mjs";
import type { LayoutSizing } from "../layout/layout-utils.types.mjs";
import type { InformSetProps } from "./animator/animator.types.mjs";
import { GeometryMerger } from "./merger/geometry-merger.mjs";
import type {
  InformedChildStyle,
  InformContext,
} from "./types/geometry-controller.types.mjs";

export class GeometryControllerUtils {
  public static prepareRootStyle(geo: LayoutSizing): InformedChildStyle {
    const inform: InformedChildStyle = {
      context: {
        index: 0,
        length: 1,
        stagger: 0,
      },
      containerExposed: {
        style: geo.container,
      },
      selfOverrides: {
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
    });
    return informed;
  }
}
