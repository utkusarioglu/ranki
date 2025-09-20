import type { NodeArgs } from "./node-arg.mjs";
import {
  NodeLeafSourceRichNumberV1,
  NodeLeafSourceNumber,
} from "./rich-number.types.mjs";
export type { NodeArgs } from "./node-arg.mjs";

export interface ParseContext {
  tokens: {
    sentence: {
      period: string;
      question: string;
      exclamation: string;
    };
    paramsV2: {
      separator: {
        left: string;
        right: string;
      };
      key: {
        negation: string;
      };
      operators: {
        assign: string;
        append: string;
        remove: string;
      };
    };
    richNumberV1: {
      complexUnits: string[];
      infinity: string[];
      e: string[];
      pi: string[];
      hexadecimal: string[];
      octal: string[];
      binary: string[];
      decimal: string;
      negative: string;
      group: string;
    };
  };
}

interface ParseNodeCommon {
  type: string;
  args: NodeArgs;
}

interface ParseNodeLeaf extends ParseNodeCommon {
  kind: "leaf";
  print: boolean;
  source: NodeLeafSource;
}

interface ParseNodeParent extends ParseNodeCommon {
  kind: "parent";
  type: string;
  children: ParseNode[];
}

export type ParseNode = ParseNodeLeaf | ParseNodeParent;

interface NodeLeafSourceString {
  type:
    | "uppercase"
    | "lowercase"
    | "propercase"
    | "mixedcase"
    | "text"
    | "mixed"
    | "token"
    | "punctuation";
  value: string;
}

export interface NodeLeafSourceDigits {
  type: "digits";
  // sign: 1 | -1;
  digits: number;
}

type NodeLeafSource =
  | NodeLeafSourceRichNumberV1
  | NodeLeafSourceNumber
  | NodeLeafSourceString;
