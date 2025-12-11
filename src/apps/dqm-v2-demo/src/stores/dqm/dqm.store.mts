import { create } from "zustand";
import type {
  DqmParseInputString,
  DqmParseInputStructured,
  DqmParseTheater,
  DqmRecord,
} from "@dqm/package-dqm-api-v2";
import type {
  Arrangement,
  CodeStore,
  SanitizationProp,
} from "./dqm.store.types.mts";
import { wrapVisible, type TemplateGroupWithList } from "./utils.mts";

const INPUTS: DqmParseInputStructured =
  JSON.parse(localStorage.getItem("current")!) || [];

const AUTO_UPDATE = JSON.parse(localStorage.getItem("autoUpdate")!) || true;

export const useCodeStore = create<CodeStore>((set) => ({
  inputs: INPUTS,
  views: INPUTS,
  templates: [],
  arrangements: [],
  autoUpdate: AUTO_UPDATE,
  astDragProps: wrapVisible(
    ["creator", "idList", "kind", "constructorName", "cpxUnique"],
    [
      "chainList",
      "childCount",
      "creationMethod",
      "ignoredCount",
      "subtreeCount",
      "meaning",
    ],
  ),
  astNoDragProps: wrapVisible(["source"], []),
  astLineageProps: wrapVisible(
    ["childrenNodes", "subtreeNodes"],
    ["tokenNodes", "spaceNodes"],
  ),
  setAutoUpdate: (autoUpdate) => set(() => ({ autoUpdate })),
  setArrangements: (arrangements: Arrangement[]) =>
    set(() => ({ arrangements })),

  setTemplates: (templates: TemplateGroupWithList[]) =>
    set(() => ({ templates })),

  setAllViewsFromInputs: () => set((state) => ({ views: state.inputs })),

  setAllInputs: (dqms: DqmRecord) =>
    set((state) => {
      const inputs = {
        ...state.inputs,
        dqms: dqms,
      };
      return { inputs };
    }),

  setTheaterDqmByIndex: (index: number, dqm: DqmParseInputString) =>
    set((state) => {
      const inputs = [...state.inputs];
      inputs[index].dqm = dqm;
      localStorage.setItem("current", JSON.stringify(inputs));
      const views = state.autoUpdate ? inputs : state.views;
      return {
        inputs,
        views,
      };
    }),

  setDragFeatureList: (astDragProps: SanitizationProp[]) =>
    set(() => ({ astDragProps })),

  setLineageFeatureList: (astLineageProps: SanitizationProp[]) =>
    set(() => ({ astLineageProps })),

  setNoDragFeatureList: (astNoDragProps: SanitizationProp[]) =>
    set(() => ({ astNoDragProps })),

  pushNewTheater: () =>
    set((state) => {
      const inputs = [...state.inputs];
      inputs.push({
        theater: "theater" + inputs.length,
        dqm: "",
      });
      const views = state.autoUpdate ? inputs : state.views;
      return {
        inputs,
        views,
      };
    }),

  removeTheaterByIndex: (index: number) =>
    set((state) => {
      const inputs = [...state.inputs];
      inputs.splice(index, 1);
      const views = state.autoUpdate ? inputs : state.views;
      return {
        inputs,
        views,
      };
    }),

  setTheaterNameByIndex: (index: number, theater: DqmParseTheater) =>
    set((state) => {
      const inputs = [...state.inputs];
      inputs[index].theater = theater;
      const views = state.autoUpdate ? inputs : state.views;
      return {
        inputs,
        views,
      };
    }),
}));
