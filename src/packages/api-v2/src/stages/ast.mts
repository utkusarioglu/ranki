export type AstNode = AstNodeLeaf | AstNodeParent;

export interface AstNodeParent extends AstNodeCommon {
  kind: "parent";
  type: string;
  children: AstNode[];
}

export interface AstNodeLeaf extends AstNodeCommon {
  kind: "leaf";
  print: boolean;
  source: AstNodeLeafSource;
}

interface AstNodeCommon {
  type: string;
  args: {
    depth: {
      block: number;
      inline: number;
      total: number;
    };
  }; // this needs to be extended by plugins
}

interface AstNodeLeafSourceString {
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

type AstNodeLeafSource = AstNodeLeafSourceNumber | AstNodeLeafSourceString;

export interface AstNodeLeafSourceNumber {
  type: "number";
  raw: string;
  number: number;
}
