import type {
  IdUnique,
  CreatorName,
  AstSourceString,
  AstSourceView,
  IAstNodeKind,
  CreationMethod,
  DqmParseTheater,
} from "@dqm/package-dqm-api-v2";

export type SanitizedNode = Partial<{
  cpxUnique: IdUnique;
  creator: CreatorName;
  source: AstSourceString | AstSourceView<any>;

  idList: string;
  chainList: string;

  childCount: number;
  subtreeCount: number;
  ignoredCount: number;

  subtree?: SanitizedNode[];
  children?: SanitizedNode[];

  kind: IAstNodeKind;
  creationMethod: CreationMethod;
  constructorName: string;
}>;

export type SanitizedAst = {
  theater: DqmParseTheater;
  sanitized: SanitizedNode;
};

export type AstSanitizationFeature = keyof SanitizedNode;
