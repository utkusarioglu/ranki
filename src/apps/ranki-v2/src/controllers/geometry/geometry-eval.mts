import type {
  CurrentAppliedStyle,
  CurrentAppliedStyleWithoutActions,
} from "./controller/types/geometry-controller.types.mjs";
import type { LocalAction } from "./geometry-intent.types.mjs";

export class GeometryEval {
  public static evaluateActions(
    curr: CurrentAppliedStyleWithoutActions,
    prev: CurrentAppliedStyle | null,
  ): LocalAction[] {
    const val = {
      curr: {
        height: curr.self.style.height || 0,
        left: curr.self.style.left || 0,
        top: curr.self.style.top || 0,
        width: curr.self.style.width || 0,
      },
      prev: {
        height: prev?.self.style.height || 0,
        left: prev?.self.style.left || 0,
        top: prev?.self.style.top || 0,
        width: prev?.self.style.width || 0,
      },
    };

    const has = {
      curr: {
        height: val.curr.height > 0,
        width: val.curr.width > 0,
      },
      prev: {
        height: val.prev.height > 0,
        width: val.prev.width > 0,
      },
    };

    const changed = {
      height: {
        enter: !has.prev.height && has.curr.height,
        leave: has.prev.height && !has.curr.height,
        resize: val.prev.height !== val.curr.height,
      },
      left: val.prev.left !== val.curr.left,
      top: val.prev.top !== val.curr.top,
      width: {
        enter: !has.prev.width && has.curr.width,
        leave: has.prev.width && !has.curr.width,
        resize: val.prev.width !== val.curr.width,
      },
    };

    const isEnter = curr.self.intent === "enter";
    const isLeave = curr.self.intent === "leave";
    const isUpdate = curr.self.intent === "update";
    const isResize =
      (changed.width.resize || changed.height.resize) && isUpdate;
    const isMove = changed.top || changed.left;

    const actions = new Set<LocalAction>();
    if (isEnter) actions.add("enter");
    if (isLeave) actions.add("leave");
    if (isResize) actions.add("resize");
    if (isMove) actions.add("move");

    if (curr.self.mode) actions.add(curr.self.mode);

    return Array.from(actions);
  }
}
