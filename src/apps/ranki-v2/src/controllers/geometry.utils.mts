import type { LitElement } from "lit";
import type { Dims, LocalAction, UpdateStyle } from "./geometry.types.mts";

export class GeometryUtils {
  public static readonly childSizeEventName = "r2-child-size";

  public static evaluateAction(
    curr: Omit<UpdateStyle, "action">,
    prev: UpdateStyle | null,
  ): LocalAction {
    const val = {
      prev: {
        width: prev?.width || 0,
        height: prev?.height || 0,
        opacity: prev?.opacity || 0,
      },
      curr: {
        width: curr.width || 0,
        height: curr.height || 0,
        opacity: curr.opacity || 0,
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
    };

    const isEnter = is.width.enter || is.height.enter || is.opacity.enter;
    const isExit = is.width.exit || is.height.exit || is.opacity.exit;
    const isExpand = is.width.expand || is.height.expand || is.opacity.expand;
    const isContract =
      is.width.contract || is.height.contract || is.opacity.contract;

    if (isEnter) return "expand";
    if (isExit) return "exit";
    if (isExpand) return "expand";
    if (isContract) return "contract";
    return "none";
  }

  public static emitConnected(host: LitElement) {
    host.dispatchEvent(
      new CustomEvent(GeometryUtils.childSizeEventName, {
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
      new CustomEvent(GeometryUtils.childSizeEventName, {
        detail: {
          type: "disconnected",
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  public static emitSize(host: LitElement, { width, height }: Dims | DOMRect) {
    host.dispatchEvent(
      new CustomEvent(GeometryUtils.childSizeEventName, {
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
