import type {
  DqmParseTheater,
  CreatorName,
  IAstNodeKind,
  CounterStat,
  CreationMethod,
  AstSourceString,
  UniqueValue,
  IdListString,
} from "@dqm/package-dqm-api-v2";
import type { TryCatch } from "../../../utils/try-catch.mjs";

export interface SuccessfulSanitizeNew {
  sanitized: SanitizedAstNew[];
}
interface SanitizeResultSuccessNew {
  state: "success";
  data: SuccessfulSanitizeNew;
}
interface SanitizeResultFail {
  state: "fail";
  error: string;
}

export type SanitizeResultNew = SanitizeResultSuccessNew | SanitizeResultFail;

export type SanitizedAstNew = {
  theater: DqmParseTheater;
  sanitized: SanitizedNodePartialNew;
};

export type SanitizedNodePartialNew = {
  key: string;
  fields: SanitizedNodePartialFields;
};

export type SanitizedNodePartialFields = Record<
  string,
  Partial<PropSanitizer<SanitizedAstNodeProps>>
>;

type PropSanitizer<T extends object> = {
  [K in keyof T]: T[K] extends any ? TryCatch<T[K]> : never;
};

type TryCatchCall<T extends object> = {
  [K in keyof T]: () => TryCatch<T[K]>;
};

export type SanitizedAstNodeCalls = TryCatchCall<SanitizedAstNodeProps>;

export type SanitizedAstNodePropKeys = keyof SanitizedAstNodeProps;

export interface SanitizedAstNodeProps {
  astUnique: UniqueValue;
  creator: CreatorName;
  idListString: IdListString;
  kind: IAstNodeKind;
  constructorName: string;
  cpxUnique: UniqueValue;
  childIndex: CounterStat;
  blockDepth: CounterStat;
  inlineDepth: CounterStat;
  chainListString: string;
  childCount: number;
  ignoredCount: number;
  subtreeCount: number;
  meaning: string | undefined;
  creationMethod: CreationMethod;
  subtreeNodes: SanitizedNodePartialNew[];
  childrenNodes: SanitizedNodePartialNew[];
  tokenNodes: SanitizedNodePartialNew[];
  spaceNodes: SanitizedNodePartialNew[];
  sourceString: AstSourceString;
}

export type SanitizedAstNodeViewMap = Record<
  string,
  SanitizedAstNodePropKeys[]
>;
