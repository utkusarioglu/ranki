import type {
  CreatorName,
  AstSourceString,
  AstSourceView,
  DqmParseInputStructured,
  DqmParseOutput,
  DqmParseTheater,
  DqmParseInputString,
  DqmRecord,
} from "@dqm/package-dqm-api-v2";

export type SanitizedNode = Partial<{
  creator: CreatorName;
  source: AstSourceString | AstSourceView<any>;
  idList: string;
  subtree?: SanitizedNode[];
  children?: SanitizedNode[];
}>;

export type SanitizationFeature =
  | "creator"
  | "idList"
  | "subtree"
  | "children"
  | "source";

export type DqmProcessed = DqmParseInputStructured & {
  parsed: DqmParseOutput;
  sanitized: Record<DqmParseTheater, SanitizedNode>;
};

export interface CodeStore {
  dragProps: Prop[];
  lineageProps: Prop[];
  noDragProps: Prop[];

  inputs: DqmParseInputStructured;
  processed: DqmProcessed;

  setAllDqms: (inputs: DqmRecord) => void;
  setTheaterDqms: (
    theater: DqmParseTheater,
    input: DqmParseInputString,
  ) => void;
  setDragFeature: (feature: Prop[]) => void;
  setLineageFeature: (feature: Prop[]) => void;
  setNoDragFeature: (feature: Prop[]) => void;
}

interface ParseResultSuccess {
  state: "success";
  data: DqmProcessed;
}

interface ParseResultFail {
  state: "fail";
  error: string;
}

export type ParseResult = ParseResultSuccess | ParseResultFail;

export type ParseRelevant = Pick<
  CodeStore,
  "dragProps" | "lineageProps" | "noDragProps" | "inputs"
>;

export type CreateDefaultsReturn = Pick<
  CodeStore,
  "dragProps" | "lineageProps" | "noDragProps" | "inputs" | "processed"
>;

export interface Prop {
  id: SanitizationFeature;
  visible: boolean;
}
