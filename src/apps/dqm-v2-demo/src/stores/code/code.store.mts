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

  ...createDefaults({
    inputs,
    viewed: inputs,
    astDragProps: wrapVisible(
      ["creator", "idList", "kind"],
      [
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

  pushTheatersToHistory: () =>
    set((state) => {
      const history = [state.inputs, ...state.history];
      return {
        history,
      };
    }),

  setTheatersFromHistory: (index: number) =>
    set((state) => {
      const inputs = state.history[index] || [];
      const history = state.history.slice(1);
      console.log(inputs, history);
      return {
        history,
        inputs,
      };
    }),

  setArrangementList: (list: Arrangement[]) =>
    set(() => ({ arrangements: list })),

  setTemplateLists: (list: TemplateGroupWithList[]) =>
    set(() => {
      return {
        templates: list,
      };
    }),

  setAllInputs: (dqms: DqmRecord) =>
    set((state) => {
      const inputs = {
        ...state.inputs,
        dqms: dqms,
      };
      return createDefaults({
        inputs,
        viewed: inputs,
        astDragProps: state.astDragProps,
        astLineageProps: state.astLineageProps,
        astNoDragProps: state.astNoDragProps,
      });
    }),

  setTheaterDqmByIndex: (index: number, dqm: DqmParseInputString) =>
    set((state) => {
      const inputs = [...state.inputs];
      inputs[index].dqm = dqm;
      return createDefaults({
        inputs,
        viewed: inputs,
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

  pushTheater: () =>
    set((state) => {
      const inputs = [...state.inputs];
      inputs.push({
        theater: "theater" + inputs.length,
        dqm: "",
      });
      return createDefaults({
        inputs,
        viewed: inputs,
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
        viewed: inputs,
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
        viewed: inputs,
        astDragProps: state.astDragProps,
        astLineageProps: state.astLineageProps,
        astNoDragProps: state.astNoDragProps,
      });
    }),
}));
