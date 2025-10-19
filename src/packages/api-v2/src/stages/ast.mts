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
  type: "whitespace" | "wi" | "clearance" | "wm" | "indentation" | "nl";
}

export interface SeparatorEntry {
  type:
    | "block"
    | "clearance"
    | "nl"
    | "whitespace"
    // ! fix this doesn't belong here. it belongs in richStructure
    | "structure";
  raw: string;
}

interface AstNodeCommon {
  type: string;
  args: {
    spaces: Record<string, WhitespaceEntry>;
    separators: SeparatorEntry[];
    depth: {
      block: number;
      inline: number;
      total: number;
    };
  }; // this needs to be extended by plugins
  // parser:
  //   | "root"
  //   | {
  //       plugin: string;
  //       chain: string[];
  //       // parser: {}
  //       // handler: string;
  //       // component: string;
  //       settings: {};
  //       directives: {};
  //     };
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
