import { DEBUG_TAG } from "_/debug.constants.mjs";
import type { R2C } from "_components/r2c/r2c.mjs";
import type { InformSetProps } from "_controllers/geometry/controller/animator/animator.types.mjs";
import type {
  CurrentAppliedStyle,
  InformedChildStyle,
} from "_controllers/geometry/controller/geometry-controller.types.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";
import type { LitElement } from "lit";

interface InformStyleDebug {
  host: LitElement;
  curr: CurrentAppliedStyle;
  prev: CurrentAppliedStyle | null;
  sizing: LayoutSizing | null;
}

interface InformSet {
  e: R2C;
  host: LitElement;
  informed: InformedChildStyle;
  props: InformSetProps;
}

export class DebugUtils {
  public static informStyle(props: InformStyleDebug) {
    if (props.host.tagName === DEBUG_TAG) {
      console.log("informStyle", {
        tag: props.host.tagName,
        curr: props.curr,
        prev: props.prev,
        sizing: props.sizing,
      });
    }
  }

  public static informSet(props: InformSet) {
    if (props.e.tagName === DEBUG_TAG) {
      console.log("informSet", {
        tag: props.host.tagName,
        e: props.e,
        informed: props.informed,
        props: props.props,
      });
    }
  }
}
