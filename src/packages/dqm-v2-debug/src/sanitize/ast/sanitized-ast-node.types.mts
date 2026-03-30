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
import type { TryCatch } from "../../utils/try-catch.mjs";

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
  fields: {
    hidden: PropSanitizer<SanitizedNodeHidden>;
    props: Partial<PropSanitizer<SanitizedNodeProps>>;
    children: Partial<PropSanitizer<SanitizedNodeChildren>>;
    stable: Partial<PropSanitizer<SanitizedNodeStable>>;
  };
};

type PropSanitizer<T extends object> = {
  [K in keyof T]: T[K] extends any ? TryCatch<T[K]> : never;
};

export interface SanitizedNodeHidden {
  cpxUnique: UniqueValue;
}

export interface SanitizedNodeProps {
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
}

export interface SanitizedNodeChildren {
  subtreeNodes: SanitizedNodePartialNew[];
  childrenNodes: SanitizedNodePartialNew[];
  tokenNodes: SanitizedNodePartialNew[];
  spaceNodes: SanitizedNodePartialNew[];
}

export interface SanitizedNodeStable {
  sourceString: AstSourceString;
}
export interface SanitizedNodeViewPreferences {
  props: (keyof SanitizedNodeProps)[];
  hidden: (keyof SanitizedNodeHidden)[];
  children: (keyof SanitizedNodeChildren)[];
  stable: (keyof SanitizedNodeStable)[];
}
