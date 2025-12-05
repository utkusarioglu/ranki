import { create } from "zustand";
import type {
  DqmParseInputString,
  DqmParseInputStructured,
  DqmParseTheater,
  DqmRecord,
} from "@dqm/package-dqm-api-v2";
import type { CodeStore, SanitizationProp, TextTemplate } from "./types.mts";
import {
  createDefaults,
  filterIds,
  sanitizeAst,
  wrapVisible,
} from "./utils.mts";

const inputs: DqmParseInputStructured = [
  {
    theater: "default",
    dqm: "hello default bunny",
  },
];

const TEXT_TEMPLATES: TextTemplate[] = [
  {
    icon: "new-text-box",
    title: "Hello world",
    description: "Two words",
    raw: "Hello World",
  },
  {
    icon: "numerical",
    title: "Integer",
    description: "Basic integer parsing",
    raw: "1 234",
  },
  {
    icon: "code",
    title: "Code block",
    description: "Basic code block",
    raw:
      `
[code
hi
]
    `.trim() + "\n",
  },
];

export const useCodeStore = create<CodeStore>((set) => ({
  textTemplates: TEXT_TEMPLATES,

  ...createDefaults({
    inputs,
    dragProps: wrapVisible(["creator", "idList"]),
    noDragProps: wrapVisible(["source"]),
    lineageProps: wrapVisible(["children", "subtree"]),
  }),

  setAllInputs: (dqms: DqmRecord) =>
    set((state) => {
      const inputs = {
        ...state.inputs,
        dqms: dqms,
      };
      return createDefaults({
        inputs,
        dragProps: state.dragProps,
        lineageProps: state.lineageProps,
        noDragProps: state.noDragProps,
      });
    }),

  setTheaterDqmByIndex: (index: number, dqm: DqmParseInputString) =>
    set((state) => {
      const inputs = [...state.inputs];
      inputs[index].dqm = dqm;
      return createDefaults({
        inputs,
        dragProps: state.dragProps,
        lineageProps: state.lineageProps,
        noDragProps: state.noDragProps,
      });
    }),

  setDragFeatureList: (dragProps: SanitizationProp[]) =>
    set(({ lineageProps, noDragProps, parsed }) => {
      return {
        dragProps,
        sanitizedAst: sanitizeAst(
          parsed,
          filterIds(dragProps, lineageProps, noDragProps),
        ),
      };
    }),

  setLineageFeatureList: (lineageProps: SanitizationProp[]) =>
    set(({ dragProps, noDragProps, parsed }) => ({
      lineageProps,
      sanitizedAst: sanitizeAst(
        parsed,
        filterIds(dragProps, lineageProps, noDragProps),
      ),
    })),

  setNoDragFeatureList: (noDragProps: SanitizationProp[]) =>
    set(({ dragProps, lineageProps, parsed }) => ({
      noDragProps,
      sanitizedAst: sanitizeAst(
        parsed,
        filterIds(dragProps, lineageProps, noDragProps),
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
        dragProps: state.dragProps,
        lineageProps: state.lineageProps,
        noDragProps: state.noDragProps,
      });
    }),

  removeTheaterByIndex: (index: number) =>
    set((state) => {
      const inputs = [...state.inputs];
      inputs.splice(index, 1);

      return createDefaults({
        inputs,
        dragProps: state.dragProps,
        lineageProps: state.lineageProps,
        noDragProps: state.noDragProps,
      });
    }),

  setTheaterNameByIndex: (index: number, theater: DqmParseTheater) =>
    set((state) => {
      const inputs = [...state.inputs];
      inputs[index].theater = theater;

      console.log(inputs, index, theater);
      return createDefaults({
        inputs,
        dragProps: state.dragProps,
        lineageProps: state.lineageProps,
        noDragProps: state.noDragProps,
      });
    }),
}));
