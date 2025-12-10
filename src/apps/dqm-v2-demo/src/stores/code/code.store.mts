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
} from "./code.store.types.mts";
import {
  createDefaults,
  filterIds,
  sanitizeAst,
  wrapVisible,
  type TemplateGroupWithList,
} from "./utils.mts";

const inputs: DqmParseInputStructured = [
  {
    theater: "default",
    dqm: "Try some Dqm",
  },
];

export const useCodeStore = create<CodeStore>((set) => ({
  templates: [],
  arrangements: [],
  history: [],
  autoUpdate: true,

  ...createDefaults({
    inputs,
    views: inputs,
    astDragProps: wrapVisible(
      ["creator", "idList", "kind", "constructorName"],
      [
        "chainList",
        "childCount",
        "cpxUnique",
        "creationMethod",
        "ignoredCount",
        "subtreeCount",
      ],
    ),
    astNoDragProps: wrapVisible(["source"], []),
    astLineageProps: wrapVisible(["children", "subtree"], []),
  }),

  pushArrangementToHistory: () =>
    set((state) => {
      const history = [state.inputs, ...state.history];
      return {
        history,
      };
    }),

  setArrangementFromHistory: (index: number) =>
    set((state) => {
      const inputs = state.history[index] || [];
      const history = state.history.slice(1);
      console.log(inputs, history);
      return {
        history,
        inputs,
      };
    }),

  setArrangements: (list: Arrangement[]) => set(() => ({ arrangements: list })),

  setTemplates: (list: TemplateGroupWithList[]) =>
    set(() => {
      return {
        templates: list,
      };
    }),

  setAllViews: (dqms: DqmRecord) =>
    set((state) => {
      const inputs = {
        ...state.inputs,
        dqms: dqms,
      };
      return createDefaults({
        inputs,
        views: inputs,
        astDragProps: state.astDragProps,
        astLineageProps: state.astLineageProps,
        astNoDragProps: state.astNoDragProps,
      });
    }),

  setAllInputs: (dqms: DqmRecord) =>
    set((state) => {
      const inputs = {
        ...state.inputs,
        dqms: dqms,
      };
      return { inputs };
      // return createDefaults({
      //   inputs,
      //   views: inputs,
      //   astDragProps: state.astDragProps,
      //   astLineageProps: state.astLineageProps,
      //   astNoDragProps: state.astNoDragProps,
      // });
    }),

  setTheaterDqmByIndex: (index: number, dqm: DqmParseInputString) =>
    set((state) => {
      const inputs = [...state.inputs];
      inputs[index].dqm = dqm;
      return createDefaults({
        inputs,
        views: inputs,
        astDragProps: state.astDragProps,
        astLineageProps: state.astLineageProps,
        astNoDragProps: state.astNoDragProps,
      });
    }),

  setDragFeatureList: (dragProps: SanitizationProp[]) =>
    set(
      ({
        astLineageProps: lineageProps,
        astNoDragProps: noDragProps,
        parsed,
      }) => {
        return {
          astDragProps: dragProps,
          sanitizedAst: sanitizeAst(
            parsed,
            filterIds(dragProps, lineageProps, noDragProps),
          ),
        };
      },
    ),

  setLineageFeatureList: (lineageProps: SanitizationProp[]) =>
    set(({ astDragProps, astNoDragProps, parsed }) => ({
      astLineageProps: lineageProps,
      sanitizedAst: sanitizeAst(
        parsed,
        filterIds(astDragProps, lineageProps, astNoDragProps),
      ),
    })),

  setNoDragFeatureList: (noDragProps: SanitizationProp[]) =>
    set(({ astDragProps, astLineageProps, parsed }) => ({
      astNoDragProps: noDragProps,
      sanitizedAst: sanitizeAst(
        parsed,
        filterIds(astDragProps, astLineageProps, noDragProps),
      ),
    })),

  pushNewTheater: () =>
    set((state) => {
      const inputs = [...state.inputs];
      inputs.push({
        theater: "theater" + inputs.length,
        dqm: "",
      });
      return createDefaults({
        inputs,
        views: inputs,
        astDragProps: state.astDragProps,
        astLineageProps: state.astLineageProps,
        astNoDragProps: state.astNoDragProps,
      });
    }),

  removeTheaterByIndex: (index: number) =>
    set((state) => {
      const inputs = [...state.inputs];
      inputs.splice(index, 1);

      return createDefaults({
        inputs,
        views: inputs,
        astDragProps: state.astDragProps,
        astLineageProps: state.astLineageProps,
        astNoDragProps: state.astNoDragProps,
      });
    }),

  setTheaterNameByIndex: (index: number, theater: DqmParseTheater) =>
    set((state) => {
      const inputs = [...state.inputs];
      inputs[index].theater = theater;

      return createDefaults({
        inputs,
        views: inputs,
        astDragProps: state.astDragProps,
        astLineageProps: state.astLineageProps,
        astNoDragProps: state.astNoDragProps,
      });
    }),
}));
