export type AstNode = AstNodeLeaf | AstNodeParent;

export interface AstNodeParent extends AstNodeCommon {
  kind: "parent";
  type: string;
  subtree: AstNode[];
  children: AstNode[];
  source: AstNodeLeafSource;
}

export interface AstNodeLeaf extends AstNodeCommon {
  kind: "leaf";
  print: boolean;
  source: AstNodeLeafSource;
}

export interface WhitespaceEntry {
  raw: string;
  type: "whitespace" | "wi" | "clearance" | "wm" | "indentation";
}

interface AstNodeCommon {
  type: string;
  args: {
    spaces: Record<string, WhitespaceEntry>;
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
    | "token"
    | "punctuation"
    | "raw";
  raw: string;
}

export type AstNodeLeafSource =
  | AstNodeLeafSourceNumber
  | AstNodeLeafSourceString;

export interface AstNodeLeafSourceNumber {
  type: "number";
  raw: string;
  number: number;
}
