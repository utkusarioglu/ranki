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
import type {
  TryCatchCall,
  TryCatchRecord,
} from "../../../utils/try-catch.mjs";

// TODO no need to keep this. it `sanitized` property can become the object itself
export interface AstNodeSanitizeSanitized {
  sanitized: AstNodeSanitized[];
}

interface AstNodeSanitizeSuccess {
  state: "success";
  data: AstNodeSanitizeSanitized;
}
interface AstNodeSanitizeFail {
  state: "fail";
  error: string;
}

export type AstNodeSanitize = AstNodeSanitizeSuccess | AstNodeSanitizeFail;

export type AstNodeSanitized = {
  theater: DqmParseTheater;
  sanitized: AstNodePartialSanitized;
};

export type AstNodePartialSanitized = {
  key: string;
  fields: AstNodeSanitizedPartialFields;
};

export type AstNodeSanitizedPartialFields = Record<
  string,
  Partial<TryCatchRecord<AstNodeSanitizedTypesRecord>>
>;

export type AstNodeSanitizedCallRecord =
  TryCatchCall<AstNodeSanitizedTypesRecord>;

export type AstNodeFilterKeys = keyof AstNodeSanitizedTypesRecord;

export interface AstNodeSanitizedTypesRecord {
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
  subtreeNodes: AstNodePartialSanitized[];
  childrenNodes: AstNodePartialSanitized[];
  tokenNodes: AstNodePartialSanitized[];
  spaceNodes: AstNodePartialSanitized[];
  sourceString: AstSourceString;
}

export type AstNodeSanitizedFiltersRecord = Record<string, AstNodeFilterKeys[]>;
