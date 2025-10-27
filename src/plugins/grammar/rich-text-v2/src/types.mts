import type {
  AstNode,
  AstNodeLeaf,
  AstNodeParent,
} from "@ranki/package-api-v2";
import type { NodeArgsBaseV2 } from "@ranki/plugin-parser-base-v2";

export type NodeArgRichTextV2WordDecoration = NodeArgRichTextV2SentenceEnd &
  NodeArgRichTextV2Abbreviation &
  NodeArgRichTextV2B &
  NodeArgRichTextV2Em &
  NodeArgRichTextV2I &
  NodeArgRichTextV2U &
  NodeArgRichTextV2LineModifiers;

export interface NodeArgRichTextV2SentenceEnd {
  "sentence.end": {
    indices: number[];
    level: number;
    types: {
      period: boolean;
      exclamation: boolean;
      question: boolean;
    };
  };
}

export interface NodeArgRichTextV2Abbreviation {
  "abbreviation.start": {
    indices: number[];
    level: number;
  };
  "abbreviation.end": {
    indices: number[];
    level: number;
  };
}

export interface NodeArgRichTextV2B {
  "b.start": {
    indices: number[];
    level: number;
  };
  "b.end": {
    indices: number[];
    level: number;
  };
}

export interface NodeArgRichTextV2Em {
  "em.start": {
    indices: number[];
    level: number;
  };
  "em.end": {
    indices: number[];
    level: number;
  };
}

export interface NodeArgRichTextV2I {
  "i.start": {
    indices: number[];
    level: number;
  };
  "i.end": {
    indices: number[];
    level: number;
  };
}

export interface NodeArgRichTextV2U {
  "u.start": {
    indices: number[];
    level: number;
  };
  "u.end": {
    indices: number[];
    level: number;
  };
}

type NodeArgRichTextV2LineModifiers = NodeArgRichTextV2Alignment &
  NodeArgRichTextV2SmallText &
  NodeArgRichTextV2Heading;

interface NodeArgRichTextV2LineModifiersCommon {
  level: number;
  clearance: number;
  type: string;
}

export interface NodeArgRichTextV2Alignment {
  "line.alignment": NodeArgRichTextV2LineModifiersCommon;
}

export interface NodeArgRichTextV2SmallText {
  "line.smalltext": NodeArgRichTextV2LineModifiersCommon;
}

export interface NodeArgRichTextV2Heading {
  "line.heading": NodeArgRichTextV2LineModifiersCommon;
}

export type NodeArgsRichTextV2 = Partial<NodeArgsBaseV2> &
  Partial<NodeArgRichTextV2WordDecoration>;

type Single = string;

export interface RankiRichTextV2ParserPluginConfig {
  tokens: {
    sentence: {
      period: Single;
      question: Single;
      exclamation: Single;
    };
    line: {
      align: Single;
      heading: Single;
      small: Single;
    };
    decoration: {
      emphasis: Single;
      bold: Single;
      idiomatic: Single;
      underline: Single;
      abbreviation: Single;
    };
  };
}

export interface WithRankiRichTextV2ParserPluginConfig {
  RankiRichTextV2: RankiRichTextV2ParserPluginConfig;
}

export type ParseNodeRichTextV2 =
  | ParseNodeRichTextV2Leaf
  | ParseNodeRichTextV2Parent;

export type ParseNodeRichTextV2Leaf = Omit<AstNodeLeaf, "shape"> & {
  shape: AstNode["shape"] & NodeArgsRichTextV2;
};

export type ParseNodeRichTextV2Parent = Omit<AstNodeParent, "shape"> & {
  shape: AstNode["shape"] & NodeArgsRichTextV2;
};

export type ParseNodeRichTextV2LeafReduced = Omit<
  ParseNodeRichTextV2Leaf,
  "shape" | "parser" | "parent"
> & {
  shape: Omit<ParseNodeRichTextV2Leaf["shape"], "depth">;
};

export type ParseNodeRichTextV2ParentReduced = Omit<
  ParseNodeRichTextV2Parent,
  "shape" | "parser" | "parent" | "subtree" | "children"
> & {
  shape: Omit<ParseNodeRichTextV2Parent["shape"], "depth">;
};
