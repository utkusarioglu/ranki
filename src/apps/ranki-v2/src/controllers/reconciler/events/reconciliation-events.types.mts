import type { LitElement } from "lit";

export type OnEmitCallback = (e: OnEmitCallbackParams) => void;

export interface R2ReconcilerEmit {
  type: "leave";
}

export type ReconcileSingle<G> = (curr: G, prev: G) => ReconciliationActions;

export type ReconciliationActions = "add" | "remove" | "retain" | "update";

interface OnEmitCallbackParams {
  detail: R2ReconcilerEmit;
  target: LitElement | null;
}
