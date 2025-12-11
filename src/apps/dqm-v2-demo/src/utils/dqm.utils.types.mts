import type {
  IdUnique,
  CreatorName,
  AstSourceString,
  AstSourceView,
  IAstNodeKind,
  CreationMethod,
  DqmParseTheater,
  DqmParseOutput,
} from "@dqm/package-dqm-api-v2";
import type { CodeStore } from "../stores/dqm/dqm.store.types.mts";

export type SanitizedNode = Partial<{
  cpxUnique: IdUnique;
  creator: CreatorName;
  source: AstSourceString | AstSourceView<any>;

  idList: string;
  chainList: string;

  childCount: number;
  subtreeCount: number;
  ignoredCount: number;

  subtreeNodes?: SanitizedNode[];
  childrenNodes?: SanitizedNode[];
  tokenNodes?: SanitizedNode[];
  spaceNodes?: SanitizedNode[];

  kind: IAstNodeKind;
  creationMethod: CreationMethod;
  constructorName: string;
  meaning: string | undefined;
}>;

export type SanitizedAst = {
  theater: DqmParseTheater;
  sanitized: SanitizedNode;
};

export type AstSanitizationFeature = keyof SanitizedNode;

export interface SuccessfulParse {
  parsed: DqmParseOutput;
  sanitized: SanitizedAst[];
}

interface ParseResultSuccess {
  state: "success";
  data: SuccessfulParse;
}

interface ParseResultFail {
  state: "fail";
  error: string;
}

export type ParseResult = ParseResultSuccess | ParseResultFail;

export type ParseRelevant = Pick<
  CodeStore,
  "astDragProps" | "astLineageProps" | "astNoDragProps" | "views"
>;
