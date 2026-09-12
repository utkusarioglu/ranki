import type { LayoutEngines } from "../engine/layout-engine.mjs";
import type { ReconcileSingle } from "../events/reconciliation-events.types.mjs";

export type GetSourceCallback<Instance, S> = (instance: Instance) => S[];

export type ReconcilerControllerParams<Instance, S> = {
  on?: ReconcilerEventsCb<Instance>;
  reconcile: ReconcileSingle<S>;
  source: GetSourceCallback<Instance, S>;
  type: ReconcilerTypes;
};

export type ReconcilerEventsCb<Instance> = (
  host: Instance,
  event: "leave",
  detail: {
    index: number;
    stagger: number;
  },
) => void;

export type ReconcilerTypes = keyof typeof LayoutEngines;
