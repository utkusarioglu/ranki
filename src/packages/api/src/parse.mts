export type ParseNode = ParseNodeLeaf | ParseNodeParent;

export interface ParseNodeParent extends ParseNodeCommon {
  kind: "parent";
  type: string;
  children: ParseNode[];
}

export interface ParseNodeLeaf extends ParseNodeCommon {
  kind: "leaf";
  print: boolean;
  source: NodeLeafSource;
}

interface ParseNodeCommon {
  type: string;
  args: NodeArgs;
}

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
  // | NodeLeafSourceRichNumberV1
  NodeLeafSourceNumber | NodeLeafSourceString;

export type NodeArgs = NodeArgNumber & NodeArgWordEnd;
// NodeArgWordDecoration &
// NodeArgLineModifiers
// FrameV2Config &
// DirectiveV2Config &
// RichNumberV1 &
// RichStructureV1 &
// FrameV1Config

type NodeArgNumber = Record<
  | "whitespace.1.length"
  | "whitespace.2.length"
  | "indentation.1.length"
  | "clearance.1.length"
  | "clearance.2.length"
  | "wm.1.length"
  | "small.level"
  | "wi.1.length",
  number
>;

export type NodeArgWordEnd = {
  "wordEnd.type": "clearance" | "nl" | "end";
};

export interface NodeLeafSourceNumber {
  type: "number";
  raw: string;
  // sign: 1 | -1;
  integer: number;
}
