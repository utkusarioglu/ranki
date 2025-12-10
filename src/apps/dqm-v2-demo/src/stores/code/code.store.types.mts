import type {
  DqmParseOutput,
  DqmParseTheater,
  DqmParseInputString,
  DqmRecord,
  DqmParseInputStructured,
} from "@dqm/package-dqm-api-v2";
import type { TemplateGroupWithList } from "./utils.mts";
import type { SanitizedAst, AstSanitizationFeature } from "./utils.types.mts";

export type CodeStoreProcessed = Pick<
  CodeStore,
  "inputs" | "parsed" | "sanitizedAst" | "views"
>;
export interface TemplateGroup {
  label: string;
  description: string;
  group: string;
}

export interface TemplateTextFetched {
  label: string;
  description: string;
  raw: string;
}

export type TemplateTextProcessed = TemplateTextFetched & {
  id: string;
};

export interface ArrangementTemplateRef {
  theater: string;
  group: string;
  index: number;
}

export interface Arrangement {
  label: string;
  description: string;
  templates: ArrangementTemplateRef[];
}

export type CodeStore = CodeStoreState & CodeStoreActions;

export interface CodeStoreState {
  templates: TemplateGroupWithList[];
  arrangements: Arrangement[];

  astDragProps: SanitizationProp[];
  astLineageProps: SanitizationProp[];
  astNoDragProps: SanitizationProp[];

  autoUpdate: boolean;
  inputs: DqmParseInputStructured;
  views: DqmParseInputStructured;
  history: DqmParseInputStructured[];

  parsed: DqmParseOutput;
  sanitizedAst: SanitizedAst[];
}

export interface CodeStoreActions {
  setAllInputs: (inputs: DqmRecord) => void;
  setAllViews: (inputs: DqmRecord) => void;

  setTheaterDqmByIndex: (index: number, dqm: DqmParseInputString) => void;
  setTheaterNameByIndex: (index: number, theater: DqmParseTheater) => void;

  pushNewTheater: () => void;
  removeTheaterByIndex: (index: number) => void;

  setDragFeatureList: (feature: SanitizationProp[]) => void;
  setLineageFeatureList: (feature: SanitizationProp[]) => void;
  setNoDragFeatureList: (feature: SanitizationProp[]) => void;

  setTemplates: (lists: TemplateGroupWithList[]) => void;
  setArrangements: (list: Arrangement[]) => void;

  setArrangementFromHistory: (index: number) => void;
  pushArrangementToHistory: () => void;
}

interface ParseResultSuccess {
  state: "success";
  data: CodeStoreProcessed;
}

interface ParseResultFail {
  state: "fail";
  error: string;
}

export type ParseResult = ParseResultSuccess | ParseResultFail;

export type ParseRelevant = Pick<
  CodeStore,
  "astDragProps" | "astLineageProps" | "astNoDragProps" | "inputs" | "views"
>;

export type CreateDefaultsReturn = Pick<
  CodeStore,
  | "astDragProps"
  | "astLineageProps"
  | "astNoDragProps"
  | "inputs"
  | "parsed"
  | "views"
  | "sanitizedAst"
>;

export interface SanitizationProp {
  id: AstSanitizationFeature;
  visible: boolean;
}
