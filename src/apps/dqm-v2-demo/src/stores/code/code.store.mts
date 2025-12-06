import { create } from "zustand";
import type {
  DqmParseInputString,
  DqmParseInputStructured,
  DqmParseTheater,
  DqmRecord,
} from "@dqm/package-dqm-api-v2";
import type {
  CodeStore,
  SanitizationProp,
  TemplateGroup,
  TemplateText,
} from "./types.mts";
import {
  buildTemplateLists,
  createDefaults,
  filterIds,
  sanitizeAst,
  wrapVisible,
} from "./utils.mts";

const inputs: DqmParseInputStructured = [
  {
    theater: "default",
    dqm: "Try some Dqm",
  },
];

const TEMPLATE_GROUPS: TemplateGroup[] = [
  {
    label: "Local storage",
    description: "Entries saved in local storage",
    group: "Storage",
  },
  {
    label: "Basic input",
    description: "Basic input features enabled by BaseV2",
    group: "Basic",
  },
  {
    label: "Frames",
    description: "FrameV2 frames",
    group: "FrameV2",
  },
];

const TEMPLATE_TEXTS: TemplateText[] = [
  {
    group: "Basic",
    label: "Hello world",
    description: "Two words",
    raw: "Hello World",
  },
  {
    group: "Basic",
    label: "Integer",
    description: "Basic integer parsing",
    raw: "1 234",
  },
  {
    group: "FrameV2",
    label: "Code block",
    description: "Basic code block",
    raw:
      `
[code
hi
]
    `.trim() + "\n",
  },
  {
    group: "FrameV2",
    label: "Nested Code Block",
    description: "Basic code block",
    raw:
      `
[code
hi

  [code
  hello [code|yees]
  ]
]
    `.trim() + "\n",
  },
  {
    group: "FrameV2",
    label: "Code, text, number",
    description: "Mix of nested code, text and number",
    raw: `
hello 123 h!

[code
hi

  [code
  hello [code|yees]
  ]
]

bunny
    `.trim(),
  },
];

export const useCodeStore = create<CodeStore>((set) => ({
  templateLists: buildTemplateLists(TEMPLATE_GROUPS, TEMPLATE_TEXTS),

  ...createDefaults({
    inputs,
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

  setTheaterDqmByMenuKey: (index: number, key: number) =>
    set((state) => {
      const inputs = [...state.inputs];
      inputs[index].dqm = TEMPLATE_TEXTS[key].raw;
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
