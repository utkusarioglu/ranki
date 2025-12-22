import { create } from "zustand";
import type { GraphViewStore } from "./graph-view.store.types.mts";

export const useGraphViewStore = create<GraphViewStore>((set) => ({
  ast: true,
  cpx: true,
  cps: true,
  param: true,
  rawParam: true,
  edgeLabels: true,

  setAst: (ast) => set(() => ({ ast })),
  setCpx: (cpx) => set(() => ({ cpx })),
  setCps: (cps) => set(() => ({ cps })),
  setParam: (param) => set(() => ({ param })),
  setRawParam: (rawParam) => set(() => ({ rawParam })),
  setEdgeLabels: (edgeLabels) => set(() => ({ edgeLabels })),
}));
