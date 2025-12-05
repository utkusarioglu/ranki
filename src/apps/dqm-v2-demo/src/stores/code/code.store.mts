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
    astDragProps: wrapVisible(["creator", "idList"]),
    astNoDragProps: wrapVisible(["source"]),
    astLineageProps: wrapVisible(["children", "subtree"]),
  }),

  setAllInputs: (dqms: DqmRecord) =>
    set((state) => {
      const inputs = {
        ...state.inputs,
        dqms: dqms,
      };
      return createDefaults({
        inputs,
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
        astDragProps: state.astDragProps,
        astLineageProps: state.astLineageProps,
        astNoDragProps: state.astNoDragProps,
      });
    }),
}));
