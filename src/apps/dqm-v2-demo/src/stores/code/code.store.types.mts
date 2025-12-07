import type {
  CreatorName,
  AstSourceString,
  AstSourceView,
  DqmParseOutput,
  DqmParseTheater,
  DqmParseInputString,
  DqmRecord,
  DqmParseInputStructured,
  IdUnique,
  IAstNodeKind,
  CreationMethod,
} from "@dqm/package-dqm-api-v2";
import type { TemplateGroupWithList } from "./utils.mts";

export type SanitizedNode = Partial<{
  cpxUnique: IdUnique;
  creator: CreatorName;
  source: AstSourceString | AstSourceView<any>;
  idList: string;
  childCount: number;
  subtreeCount: number;
  ignoredCount: number;
  subtree?: SanitizedNode[];
  children?: SanitizedNode[];
  kind: IAstNodeKind;
  creationMethod: CreationMethod;
}>;

export type SanitizedAst = {
  theater: DqmParseTheater;
  sanitized: SanitizedNode;
};

export type AstSanitizationFeature = keyof SanitizedNode;

export type CodeStoreProcessed = Pick<
  CodeStore,
  "inputs" | "parsed" | "sanitizedAst" | "viewed"
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

  inputs: DqmParseInputStructured;
  viewed: DqmParseInputStructured;
  history: DqmParseInputStructured[];

  parsed: DqmParseOutput;
  sanitizedAst: SanitizedAst[];
}

export interface CodeStoreActions {
  setAllInputs: (inputs: DqmRecord) => void;
  setTheaterDqmByIndex: (index: number, dqm: DqmParseInputString) => void;
  setTheaterNameByIndex: (index: number, theater: DqmParseTheater) => void;
  pushTheater: () => void;
  removeTheaterByIndex: (index: number) => void;
  setDragFeatureList: (feature: SanitizationProp[]) => void;
  setLineageFeatureList: (feature: SanitizationProp[]) => void;
  setNoDragFeatureList: (feature: SanitizationProp[]) => void;
  setTemplateLists: (lists: TemplateGroupWithList[]) => void;
  setArrangementList: (list: Arrangement[]) => void;
  setTheatersFromHistory: (index: number) => void;
  pushTheatersToHistory: () => void;
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
  "astDragProps" | "astLineageProps" | "astNoDragProps" | "inputs" | "viewed"
>;

export type CreateDefaultsReturn = Pick<
  CodeStore,
  | "astDragProps"
  | "astLineageProps"
  | "astNoDragProps"
  | "inputs"
  | "parsed"
  | "viewed"
  | "sanitizedAst"
>;

export interface SanitizationProp {
  id: AstSanitizationFeature;
  visible: boolean;
}
