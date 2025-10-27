import { RankiLangAstContext, RankiLangContextInstance } from "../export.mjs";

export type AstNode = AstNodeLeaf | AstNodeParent;

export type AstNodeReduced = AstNodeLeafReduced | AstNodeParentReduced;

export interface AstNodeParent extends AstNodeCommon {
  kind: "parent";
  creator: string;
  subtree: {}; // this is supposed to be overwritten by implementers which have subtrees
  children: AstNode[];
  source: AstNodeLeafSource;
}

export type AstNodeLeafReduced = Omit<
  AstNodeLeaf,
  "shape" | "parent" | "parser"
> & {
  shape: Omit<AstNodeCommon["shape"], "depth">;
};

export type AstNodeParentReduced = Omit<
  AstNodeParent,
  "shape" | "parent" | "children" | "subtree" | "parser"
> & {
  shape: Omit<AstNodeCommon["shape"], "depth">;
};

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
  creator: string;
  parent: AstNode;
  shape: {
    spaces: Record<string, WhitespaceEntry>;
    separators: SeparatorEntry[];
    depth: {
      block: number;
      inline: number;
      total: number;
    };
  };
  parser: {
    hash: ReturnType<RankiLangContextInstance["getHash"]>;
  };
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
