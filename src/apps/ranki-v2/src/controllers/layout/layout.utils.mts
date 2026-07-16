import type {
  InformedChildStyle,
  LocalAction,
} from "_controllers/geometry/geometry.types.mjs";
import type { HostType } from "./layout.controller.types.mts";
import type { Size } from "_utils/sizing.utils.mjs";
import type { LayoutSize } from "./layout.types.mts";
import type { LayoutEvent } from "./layout.event.types.mts";

export type EmitModes = "hover-start" | "hover-end";

export class LayoutUtils {
  public static readonly geometryEventName = "r2-geometry";

  public static evaluateActions(
    curr: InformedChildStyle,
    prev: InformedChildStyle | null,
  ): LocalAction[] {
    const val = {
      prev: {
        width: prev?.width || 0,
        height: prev?.height || 0,
        top: prev?.top || 0,
        left: prev?.left || 0,
      },
      curr: {
        width: curr.width || 0,
        height: curr.height || 0,
        top: curr.top || 0,
        left: curr.left || 0,
      },
    };

    const has = {
      prev: {
        width: val.prev.width > 0,
        height: val.prev.height > 0,
      },
      curr: {
        width: val.curr.width > 0,
        height: val.curr.height > 0,
      },
    };

    const is = {
      width: {
        enter: !has.prev.width && has.curr.width,
        resize: val.prev.width !== val.curr.width,
        leave: has.prev.width && !has.curr.width,
      },
      height: {
        enter: !has.prev.height && has.curr.height,
        resize: val.prev.height !== val.curr.height,
        leave: has.prev.height && !has.curr.height,
      },
      top: val.prev.top !== val.curr.top,
      left: val.prev.left !== val.curr.left,
    };

    const isEnter = curr.intent === "enter";
    const isLeave = curr.intent === "leave";
    const isUpdate = curr.intent === "update";
    const isResize = (is.width.resize || is.height.resize) && isUpdate;
    const isMove = is.top || is.left;

    const actions = new Set<LocalAction>();
    if (isEnter) actions.add("enter");
    if (isLeave) actions.add("leave");
    if (isResize) actions.add("resize");
    if (isMove) actions.add("move");

    if (curr.mode) actions.add(curr.mode);

    return Array.from(actions);
  }

  // public static emitConnected(host: LitElement) {
  //   host.dispatchEvent(
  //     new CustomEvent(LayoutUtils.geometryEventName, {
  //       detail: {
  //         intent: "connected",
  //       },
  //       bubbles: true,
  //       composed: true,
  //     }),
  //   );
  // }

  public static emit(host: HostType, payload: LayoutEvent) {
    host.dispatchEvent(
      new CustomEvent(LayoutUtils.geometryEventName, {
        detail: payload,
        // {
        //   intent: "leave",
        // },
        bubbles: true,
        composed: true,
      }),
    );
    // switch (payload.intent) {
    //   case "update":
    //     assertNotUndefined(dims, {
    //       why: "Dims are required for emitting size",
    //     });
    //     this.emitUpdate(this.host, dims);
    //     break;
    //   case "leave":
    //     this.emitLeave(this.host);
    //     break;
    //   case "mode":
    //     assertNotUndefined(dims, {
    //       why: "Dims are required for emitting size",
    //     });
    //     this.emitMode(host, payload);
    //     break;
    //   default:
    //     assertNever({
    //       why: "Unrecognized emit intent",
    //       details: { payload },
    //     });
    // }
  }

  // public static emitLeave(host: LitElement) {
  //   host.dispatchEvent(
  //     new CustomEvent(LayoutUtils.geometryEventName, {
  //       detail: {
  //         intent: "leave",
  //       },
  //       bubbles: true,
  //       composed: true,
  //     }),
  //   );
  // }

  // public static emitMode(host: LitElement, mode: EmitModes) {
  //   host.dispatchEvent(
  //     new CustomEvent(LayoutUtils.geometryEventName, {
  //       detail: {
  //         intent: "mode",
  //         mode,
  //       },
  //       bubbles: true,
  //       composed: true,
  //     }),
  //   );
  // }

  // public static emitUpdate(host: LitElement, { width, height }: Dims) {
  //   host.dispatchEvent(
  //     new CustomEvent(LayoutUtils.geometryEventName, {
  //       detail: {
  //         intent: "update",
  //         rect: { width, height },
  //       },
  //       bubbles: true,
  //       composed: true,
  //     }),
  //   );
  // }
}
