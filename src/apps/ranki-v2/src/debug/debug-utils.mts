import { DEBUG_TAG } from "_/debug/debug.constants.mjs";
import type { R2C } from "_components/r2c/r2c.mjs";
import type {
  InformSetProps,
  LayoutParsed,
} from "_controllers/geometry/controller/animator/animator.types.mjs";
import type { ChildrenSizing } from "_controllers/geometry/controller/sets/children/children.types.mjs";
import type { LayoutSizing } from "_controllers/geometry/controller/sets/children/layout/layout-utils.types.mjs";
import type {
  CurrentAppliedStyle,
  InformedChildStyle,
} from "_controllers/geometry/controller/types/geometry-controller.types.mjs";
import type { LitElement } from "lit";

interface AnimatorUpdateComposedProps {
  host: LitElement;
  composed: LayoutParsed;
}

interface AnimatorPlayNameProps {
  host: LitElement;
  finalOptions: KeyframeAnimationOptions;
  finalKeyframes: Keyframe[];
}
interface InformStyleDebug {
  host: LitElement;
  curr: CurrentAppliedStyle;
  prev: CurrentAppliedStyle | null;
  sizing: LayoutSizing | null;
  informed: InformedChildStyle;
}

interface InformSet {
  e: R2C;
  host: LitElement;
  informed: InformedChildStyle;
  props: InformSetProps;
}

interface AnimatorUpdate {
  host: LitElement;
  curr: CurrentAppliedStyle;
  prev: CurrentAppliedStyle | null;
}
interface GeometryControllerOnEmitProps {
  host: LitElement;
  update: ChildrenSizing | null;
}
export class DebugUtils {
  public static geometryControllerOnEmit({
    host,
    update,
  }: GeometryControllerOnEmitProps) {
    if (host.tagName === DEBUG_TAG) {
      console.log("controller.onEmit", {
        tagName: host.tagName,
        update,
      });
    }
  }

  public static informStyle(props: InformStyleDebug) {
    if (props.host.tagName === DEBUG_TAG) {
      console.log("controller.informStyle", {
        tag: props.host.tagName,
        curr: props.curr,
        prev: props.prev,
        sizing: props.sizing,
        informed: props.informed,
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

  public static animatorUpdate(props: AnimatorUpdate) {
    if (props.host.tagName === DEBUG_TAG)
      console.log("animator.update", {
        host: props.host,
        curr: props.curr,
        prev: props.prev,
      });
  }

  public static animatorUpdateComposed({
    host,
    composed,
  }: AnimatorUpdateComposedProps) {
    if (host.tagName === DEBUG_TAG)
      console.log("animator.update.composed", {
        composed,
      });
  }

  public static animatorPlayName({
    host,
    finalKeyframes,
    finalOptions,
  }: AnimatorPlayNameProps) {
    if (host.tagName === DEBUG_TAG)
      console.log("animator.playName", {
        finalKeyframes,
        finalOptions,
      });
  }
}
