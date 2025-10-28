export type NodeOmitted =
  | "shape"
  | "parser"
  | "subtree"
  | "children"
  | "parent"
  | "plugins";

export type ArgsOmitted = "depth";

export type OmittedType<T extends { shape: any }> = Omit<T, NodeOmitted> & {
  shape: Omit<T["shape"], ArgsOmitted>;
};
