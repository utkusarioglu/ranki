import type { LitElement } from "lit";
import type {
  Dims,
  LocalAction,
  UpdateStyle,
} from "_controllers/geometry/geometry.types.mjs";

export class GeometryUtils {
  public static readonly geometryEventName = "r2-geometry";

  public static evaluateActions(
    curr: Omit<UpdateStyle, "action">,
    prev: UpdateStyle | null,
  ): LocalAction[] {
    const val = {
      prev: {
        width: prev?.width || 0,
        height: prev?.height || 0,
        opacity: prev?.opacity || 0,
        top: prev?.top || 0,
        left: prev?.left || 0,
      },
      curr: {
        width: curr.width || 0,
        height: curr.height || 0,
        opacity: curr.opacity || 0,
        top: curr.top || 0,
        left: curr.left || 0,
      },
    };

    const has = {
      prev: {
        width: val.prev.width > 0,
        height: val.prev.height > 0,
        opacity: val.prev.opacity > 0,
      },
      curr: {
        width: val.curr.width > 0,
        height: val.curr.height > 0,
        opacity: val.curr.opacity > 0,
      },
    };

    const is = {
      width: {
        enter: !has.prev.width && has.curr.width,
        expand: val.prev.width < val.curr.width,
        contract: val.prev.width > val.curr.width,
        exit: has.prev.width && !has.curr.width,
      },
      height: {
        enter: !has.prev.height && has.curr.height,
        expand: val.prev.height < val.curr.height,
        contract: val.prev.height > val.curr.height,
        exit: has.prev.height && !has.curr.height,
      },
      opacity: {
        enter: !has.prev.opacity && has.curr.opacity,
        expand: val.prev.opacity < val.curr.opacity,
        contract: val.prev.opacity > val.curr.opacity,
        exit: has.prev.opacity && !has.curr.opacity,
      },
      top: val.prev.top !== val.curr.top,
      left: val.prev.left !== val.curr.left,
    };

    const isEnter = is.width.enter || is.height.enter || is.opacity.enter;
    const isExit = is.width.exit || is.height.exit || is.opacity.exit;
    const isExpand = is.width.expand || is.height.expand || is.opacity.expand;
    const isContract =
      is.width.contract || is.height.contract || is.opacity.contract;
    const isMove = is.top || is.left;

    // console.log({ is, has, val, isEnter, isExit, isExpand, isContract });
    const actions = new Set<LocalAction>();

    if (isEnter) actions.add("expand");
    if (isExit) actions.add("exit");
    if (isExpand) actions.add("expand");
    if (isContract) actions.add("contract");
    if (isMove) actions.add("move");
    return Array.from(actions);
    // return "none";
  }

  public static emitConnected(host: LitElement) {
    host.dispatchEvent(
      new CustomEvent(GeometryUtils.geometryEventName, {
        detail: {
          type: "connected",
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  public static emitDisconnected(host: LitElement) {
    host.dispatchEvent(
      new CustomEvent(GeometryUtils.geometryEventName, {
        detail: {
          type: "disconnected",
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  public static emitLeave(host: LitElement) {
    host.dispatchEvent(
      new CustomEvent(GeometryUtils.geometryEventName, {
        detail: {
          type: "leave",
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  public static emitSize(host: LitElement, { width, height }: Dims | DOMRect) {
    host.dispatchEvent(
      new CustomEvent(GeometryUtils.geometryEventName, {
        detail: {
          type: "update",
          rect: { width, height },
        },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
