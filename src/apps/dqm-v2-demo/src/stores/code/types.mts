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
// import type { MenuProps } from "antd";
import type { TemplateLists } from "./utils.mts";

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
  "inputs" | "parsed" | "sanitizedAst"
>;
export interface TemplateGroup {
  label: string;
  description: string;
  group: string;
}

export interface TemplateText {
  group: string;
  label: string;
  description: string;
  raw: string;
}

// export type MenuItem = Required<MenuProps>["items"][number];

export interface CodeStore {
  templateLists: TemplateLists;

  astDragProps: SanitizationProp[];
  astLineageProps: SanitizationProp[];
  astNoDragProps: SanitizationProp[];

  inputs: DqmParseInputStructured;
  parsed: DqmParseOutput;
  sanitizedAst: SanitizedAst[];

  setAllInputs: (inputs: DqmRecord) => void;
  setTheaterDqmByIndex: (index: number, dqm: DqmParseInputString) => void;
  setTheaterDqmByMenuKey: (index: number, key: number) => void;
  setTheaterNameByIndex: (index: number, theater: DqmParseTheater) => void;
  // setTheaterVisibilityByIndex: (index: number, visible: boolean) => void;
  pushTheater: () => void;
  removeTheaterByIndex: (index: number) => void;
  setDragFeatureList: (feature: SanitizationProp[]) => void;
  setLineageFeatureList: (feature: SanitizationProp[]) => void;
  setNoDragFeatureList: (feature: SanitizationProp[]) => void;
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
  "astDragProps" | "astLineageProps" | "astNoDragProps" | "inputs"
>;

export type CreateDefaultsReturn = Pick<
  CodeStore,
  | "astDragProps"
  | "astLineageProps"
  | "astNoDragProps"
  | "inputs"
  | "parsed"
  | "sanitizedAst"
>;

export interface SanitizationProp {
  id: AstSanitizationFeature;
  visible: boolean;
}
