export type TransformClass = string & { type?: "TransformClass" };

// export type TransformClassDict<Stored> = Map<TransformClass, Stored>;
// {
//   transformClass: TransformClass;
//   node: IAstNode;
// }

export interface IAstNodeTransformCapability {
  setTransformClass(tc: TransformClass): this;
  getTransformClass(): TransformClass | null;
  // collectTransformClasses(): TransformClassDict<Stored>;
}
