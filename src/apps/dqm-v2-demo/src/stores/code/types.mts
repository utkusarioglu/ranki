import type { BlueprintIcons_16Id } from "@blueprintjs/icons/lib/esm/generated/16px/blueprint-icons-16";
import type {
  CreatorName,
  AstSourceString,
  AstSourceView,
  DqmParseOutput,
  DqmParseTheater,
  DqmParseInputString,
  DqmRecord,
  DqmParseInputStructured,
} from "@dqm/package-dqm-api-v2";

export type SanitizedNode = Partial<{
  creator: CreatorName;
  source: AstSourceString | AstSourceView<any>;
  idList: string;
  subtree?: SanitizedNode[];
  children?: SanitizedNode[];
}>;

export type SanitizedAst = {
  theater: DqmParseTheater;
  sanitized: SanitizedNode;
};

export type AstSanitizationFeature =
  | "creator"
  | "idList"
  | "subtree"
  | "children"
  | "source";

export type CodeStoreProcessed = Pick<
  CodeStore,
  "inputs" | "parsed" | "sanitizedAst"
>;

export interface TextTemplate {
  icon: BlueprintIcons_16Id;
  title: string;
  description: string;
  raw: string;
}

export interface CodeStore {
  textTemplates: TextTemplate[];

  astDragProps: SanitizationProp[];
  astLineageProps: SanitizationProp[];
  astNoDragProps: SanitizationProp[];

  inputs: DqmParseInputStructured;
  parsed: DqmParseOutput;
  sanitizedAst: SanitizedAst[];

  setAllInputs: (inputs: DqmRecord) => void;
  setTheaterDqmByIndex: (index: number, dqm: DqmParseInputString) => void;
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
