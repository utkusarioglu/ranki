export type NodeOmmited = "shape" | "parser" | "subtree" | "children" | "parent";
export type ArgsOmitted = "depth";
export type OmittedType<T extends {
    shape: any;
}> = Omit<T, NodeOmmited> & {
    shape: Omit<T["shape"], ArgsOmitted>;
};
