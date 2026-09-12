import type { LitElement } from "lit";

export type OnEmitCallback = (e: OnEmitCallbackParams) => void;

export interface R2ReconcilerEmit {
  type: "leave";
}

export type ReconcileSingle<G> = (curr: G, prev: G) => ReconciliationAction;

export type HasChangedCallback2<G> = (
  curr: G,
  prev: G,
) => ReconciliationActionRec[];

export type ReconciliationActionRec =
  | ReconciliationActionPrev
  | ReconciliationActionCurr;

interface ReconciliationActionPrev {
  type: "prev";
  // advance: boolean;
  action: "keep" | "remove";
}

interface ReconciliationActionCurr {
  type: "curr";
  action: "add" | "update";
}
//   {
//   type: "curr"
//   prev: "keep" | "remove";
// }
export type ReconciliationAction = "add" | "remove" | "retain" | "update";

interface OnEmitCallbackParams {
  detail: R2ReconcilerEmit;
  target: LitElement | null;
}
