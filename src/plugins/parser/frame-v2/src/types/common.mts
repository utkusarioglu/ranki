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

export type ArgsOmitted = "depth";

export type OmittedType<T extends { shape: any }> = Omit<T, NodeOmitted> & {
  shape: Omit<T["shape"], ArgsOmitted>;
};
