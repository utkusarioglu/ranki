export type NodeArgsBaseV2 = NodeArgNumber & NodeArgWordEnd;

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
