import type { ShapeOmitted } from "@ranki/package-api-v2";

export type NodeOmitted =
  | "creator"
  | "shape"
  | "parser"
  | "subtree"
  | "children"
  | "parent"
  | "plugins"
  | "source"
  | "context";

// export type ArgsOmitted = "depth" | "hoist";
export type ArgsOmitted = ShapeOmitted;

export type OmittedType<T extends { shape: any }> = Omit<T, NodeOmitted> & {
  shape: Omit<T["shape"], ArgsOmitted>;
};
