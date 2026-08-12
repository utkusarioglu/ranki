import type { LocalAction } from "../events/geometry-events.types.mjs";
import type { GeometryInteractionEmit } from "../events/geometry-events.types.mjs";
import type { CurrentAppliedStyleWithoutActions } from "../types/geometry-controller.types.mjs";

export class GeometryEval {
  public static evaluateActions(
    curr: CurrentAppliedStyleWithoutActions,
    // prev: CurrentAppliedStyle | null,
  ): LocalAction[] {
    // const val = {
    //   curr: {
    //     height: curr.self.style.height || 0,
    //     left: curr.self.style.left || 0,
    //     top: curr.self.style.top || 0,
    //     width: curr.self.style.width || 0,
    //   },
    //   prev: {
    //     height: prev?.self.style.height || 0,
    //     left: prev?.self.style.left || 0,
    //     top: prev?.self.style.top || 0,
    //     width: prev?.self.style.width || 0,
    //   },
    // };

    // const has = {
    //   curr: {
    //     height: val.curr.height > 0,
    //     width: val.curr.width > 0,
    //   },
    //   prev: {
    //     height: val.prev.height > 0,
    //     width: val.prev.width > 0,
    //   },
    // };

    // const changed = {
    //   height: {
    //     enter: !has.prev.height && has.curr.height,
    //     leave: has.prev.height && !has.curr.height,
    //     resize: val.prev.height !== val.curr.height,
    //   },
    //   left: val.prev.left !== val.curr.left,
    //   top: val.prev.top !== val.curr.top,
    //   width: {
    //     enter: !has.prev.width && has.curr.width,
    //     leave: has.prev.width && !has.curr.width,
    //     resize: val.prev.width !== val.curr.width,
    //   },
    // };

    // const isEnter = curr.self.intent === "enter";
    // const isLeave = curr.self.intent === "leave";
    // const isUpdate = curr.self.intent === "update";
    // const isResize =
    //   (changed.width.resize || changed.height.resize) && isUpdate;
    // const isMove = changed.top || changed.left;

    const actions = new Set<LocalAction>();
    // actions.add("enter");
    // if (isEnter) actions.add("enter");
    // if (isLeave) actions.add("leave");
    // if (isResize) actions.add("update");
    // if (isMove) actions.add("update");

    if (["enter", "leave", "update"].includes(curr.self.lifecycle)) {
      actions.add(curr.self.lifecycle);
    }
    Object.entries(curr.self.interaction)
      .filter((v) => v[1] !== "none")
      .map((v) => v.join("-") as GeometryInteractionEmit)
      .forEach((v) => actions.add(v));
    // if (curr.self.interaction !== "idle") {
    //   actions.add(curr.self.interaction);
    // }

    return Array.from(actions);
  }

  // public static evaluateActions_OLD(
  //   curr: CurrentAppliedStyleWithoutActions,
  //   prev: CurrentAppliedStyle | null,
  // ): LocalAction[] {
  //   const val = {
  //     curr: {
  //       height: curr.self.style.height || 0,
  //       left: curr.self.style.left || 0,
  //       top: curr.self.style.top || 0,
  //       width: curr.self.style.width || 0,
  //     },
  //     prev: {
  //       height: prev?.self.style.height || 0,
  //       left: prev?.self.style.left || 0,
  //       top: prev?.self.style.top || 0,
  //       width: prev?.self.style.width || 0,
  //     },
  //   };

  //   const has = {
  //     curr: {
  //       height: val.curr.height > 0,
  //       width: val.curr.width > 0,
  //     },
  //     prev: {
  //       height: val.prev.height > 0,
  //       width: val.prev.width > 0,
  //     },
  //   };

  //   const changed = {
  //     height: {
  //       enter: !has.prev.height && has.curr.height,
  //       leave: has.prev.height && !has.curr.height,
  //       resize: val.prev.height !== val.curr.height,
  //     },
  //     left: val.prev.left !== val.curr.left,
  //     top: val.prev.top !== val.curr.top,
  //     width: {
  //       enter: !has.prev.width && has.curr.width,
  //       leave: has.prev.width && !has.curr.width,
  //       resize: val.prev.width !== val.curr.width,
  //     },
  //   };

  //   const isEnter = curr.self.lifecycle === "enter";
  //   const isLeave = curr.self.lifecycle === "leave";
  //   const isUpdate = curr.self.lifecycle === "update";
  //   const isResize =
  //     (changed.width.resize || changed.height.resize) && isUpdate;
  //   const isMove = changed.top || changed.left;

  //   const actions = new Set<LocalAction>();
  //   actions.add("enter");
  //   if (isEnter) actions.add("enter");
  //   if (isLeave) actions.add("leave");
  //   if (isResize) actions.add("update");
  //   if (isMove) actions.add("update");

  //   if (["enter", "update", "leave"].includes(curr.self.lifecycle)) {
  //     actions.add(curr.self.lifecycle);
  //   }
  //   if (curr.self.interaction) actions.add(curr.self.interaction);

  //   return Array.from(actions);
  // }
}
