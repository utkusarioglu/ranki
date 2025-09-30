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
  args: {
    depth: {
      block: number;
      inline: number;
      total: number;
    };
  }; // this needs to be extended by plugins
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

type NodeLeafSource = NodeLeafSourceNumber | NodeLeafSourceString;

export interface NodeLeafSourceNumber {
  type: "number";
  raw: string;
  number: number;
}
