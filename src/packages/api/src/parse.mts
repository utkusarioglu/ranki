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
  args: {}; // this needs to be overwritten by the plugins
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

// export interface NodeLeafSourceDigits {
//   type: "digits";
//   digits: number;
// }

type NodeLeafSource = NodeLeafSourceNumber | NodeLeafSourceString;

export interface NodeLeafSourceNumber {
  type: "number";
  raw: string;
  number: number;
}
