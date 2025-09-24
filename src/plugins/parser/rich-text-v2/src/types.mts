export type NodeArgWordDecoration = NodeArgSentenceEnd &
  NodeArgAbbreviation &
  NodeArgB &
  NodeArgEm &
  NodeArgI &
  NodeArgU &
  NodeArgLineModifiers;

export interface NodeArgSentenceEnd {
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

export interface NodeArgAbbreviation {
  "abbreviation.start": {
    indices: number[];
    level: number;
  };
  "abbreviation.end": {
    indices: number[];
    level: number;
  };
}

export interface NodeArgB {
  "b.start": {
    indices: number[];
    level: number;
  };
  "b.end": {
    indices: number[];
    level: number;
  };
}

export interface NodeArgEm {
  "em.start": {
    indices: number[];
    level: number;
  };
  "em.end": {
    indices: number[];
    level: number;
  };
}

export interface NodeArgI {
  "i.start": {
    indices: number[];
    level: number;
  };
  "i.end": {
    indices: number[];
    level: number;
  };
}

export interface NodeArgU {
  "u.start": {
    indices: number[];
    level: number;
  };
  "u.end": {
    indices: number[];
    level: number;
  };
}

type NodeArgLineModifiers = NodeArgAlignment &
  NodeArgSmallText &
  NodeArgHeading;

interface NodeArgLineModifiersCommon {
  level: number;
  clearance: number;
  type: string;
}

export interface NodeArgAlignment {
  "line.alignment": NodeArgLineModifiersCommon;
}

export interface NodeArgSmallText {
  "line.smalltext": NodeArgLineModifiersCommon;
}

export interface NodeArgHeading {
  "line.heading": NodeArgLineModifiersCommon;
}
