import type { AstNode as ParseNodeBaseV2 } from "@ranki/package-api-v2";
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

export type ParseNodeRichTextV2 = Omit<ParseNodeBaseV2, "args"> & {
  args: ParseNodeBaseV2["args"] & NodeArgsRichTextV2;
};
