import type { InformedChildStyle } from "./controller/geometry-controller.types.mts";
import type { LocalAction } from "./geometry-intent.types.mts";

export class GeometryEval {
  public static evaluateActions(
    curr: InformedChildStyle,
    prev: InformedChildStyle | null,
  ): LocalAction[] {
    const val = {
      prev: {
        width: prev?.item.style.width || 0,
        height: prev?.item.style.height || 0,
        top: prev?.item.style.top || 0,
        left: prev?.item.style.left || 0,
      },
      curr: {
        width: curr.item.style.width || 0,
        height: curr.item.style.height || 0,
        top: curr.item.style.top || 0,
        left: curr.item.style.left || 0,
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

    const isEnter = curr.item.intent === "enter";
    const isLeave = curr.item.intent === "leave";
    const isUpdate = curr.item.intent === "update";
    const isResize = (is.width.resize || is.height.resize) && isUpdate;
    const isMove = is.top || is.left;

    const actions = new Set<LocalAction>();
    if (isEnter) actions.add("enter");
    if (isLeave) actions.add("leave");
    if (isResize) actions.add("resize");
    if (isMove) actions.add("move");

    if (curr.item.mode) actions.add(curr.item.mode);

    return Array.from(actions);
  }
}
