export type NodeArgsBaseV2 = NodeArgBaseV2Number & NodeArgBaseV2WordEnd;

type NodeArgBaseV2Number = Record<
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

export type NodeArgBaseV2WordEnd = {
  "wordEnd.type": "clearance" | "nl" | "end";
};
