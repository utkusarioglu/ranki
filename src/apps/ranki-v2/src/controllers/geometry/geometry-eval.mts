import type {
  CurrentAppliedStyle,
  CurrentAppliedStyleWithoutActions,
} from "./controller/types/geometry-controller.types.mts";
import type { LocalAction } from "./geometry-intent.types.mts";

export class GeometryEval {
  public static evaluateActions(
    curr: CurrentAppliedStyleWithoutActions,
    prev: CurrentAppliedStyle | null,
  ): LocalAction[] {
    const val = {
      prev: {
        width: prev?.self.style.width || 0,
        height: prev?.self.style.height || 0,
        top: prev?.self.style.top || 0,
        left: prev?.self.style.left || 0,
      },
      curr: {
        width: curr.self.style.width || 0,
        height: curr.self.style.height || 0,
        top: curr.self.style.top || 0,
        left: curr.self.style.left || 0,
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

    const isEnter = curr.self.intent === "enter";
    const isLeave = curr.self.intent === "leave";
    const isUpdate = curr.self.intent === "update";
    const isResize = (is.width.resize || is.height.resize) && isUpdate;
    const isMove = is.top || is.left;

    const actions = new Set<LocalAction>();
    if (isEnter) actions.add("enter");
    if (isLeave) actions.add("leave");
    if (isResize) actions.add("resize");
    if (isMove) actions.add("move");

    if (curr.self.mode) actions.add(curr.self.mode);

    return Array.from(actions);
  }
}
