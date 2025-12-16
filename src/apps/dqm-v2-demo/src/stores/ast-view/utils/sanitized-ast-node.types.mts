import type {
  DqmParseTheater,
  CreatorName,
  IAstNodeKind,
  IdUnique,
  CounterStat,
  CreationMethod,
  AstSourceString,
} from "@dqm/package-dqm-api-v2";

export interface SuccessfulSanitize {
  sanitized: SanitizedAst[];
}
interface SanitizeResultSuccess {
  state: "success";
  data: SuccessfulSanitize;
}
interface SanitizeResultFail {
  state: "fail";
  error: string;
}

export type SanitizeResult = SanitizeResultSuccess | SanitizeResultFail;

export type SanitizedAst = {
  theater: DqmParseTheater;
  sanitized: SanitizedNodePartial;
};

export type SanitizedNodePartial = {
  key: string;
  fields: {
    props: Partial<SanitizedNodeProps>;
    children: Partial<SanitizedNodeChildren>;
    stable: Partial<SanitizedNodeStable>;
  };
};

export interface SanitizedNodeProps {
  creator: CreatorName;
  idList: string;
  kind: IAstNodeKind;
  constructorName: string;
  cpxUnique: IdUnique;
  childIndex: CounterStat;
  blockDepth: CounterStat;
  inlineDepth: CounterStat;
  chainList: string;
  childCount: number;
  ignoredCount: number;
  subtreeCount: number;
  meaning: string | undefined;
  creationMethod: CreationMethod;
}

export interface SanitizedNodeChildren {
  subtreeNodes: SanitizedNodePartial[];
  childrenNodes: SanitizedNodePartial[];
  tokenNodes: SanitizedNodePartial[];
  spaceNodes: SanitizedNodePartial[];
}

export interface SanitizedNodeStable {
  // sourceString: string; // AstSourceString | AstSourceView<any>;
  sourceString: AstSourceString;
}
export interface SanitizedNodeViewPreferences {
  props: (keyof SanitizedNodeProps)[];
  children: (keyof SanitizedNodeChildren)[];
  stable: (keyof SanitizedNodeStable)[];
}
