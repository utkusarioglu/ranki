import type { ReconcileSingle } from "./utils.types.mjs";

export type GetSourceCallback<Instance, S> = (instance: Instance) => S[];

export type ReconcilerEventsCb<Instance> = (
  host: Instance,
  event: "leave",
  detail: {
    index: number;
    stagger: number;
  },
) => void;

export type ReconcilerTypes = "flat" | "last";

export type SubtreeParams<Instance, S> = {
  on?: ReconcilerEventsCb<Instance>;
  reconcile: ReconcileSingle<S>;
  source: GetSourceCallback<Instance, S>;
  type: ReconcilerTypes;
};
