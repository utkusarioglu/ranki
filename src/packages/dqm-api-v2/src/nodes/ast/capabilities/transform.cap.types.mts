export type TransformClass = string & { type?: "TransformClass" };

export type TransformClassDict<Stored> = Map<TransformClass, Stored>;
// {
//   transformClass: TransformClass;
//   node: IAstNode;
// }

export interface IAstNodeTransformCapability<Stored> {
  setTransformClass(tc: TransformClass): this;
  getTransformClass(): TransformClass | null;
  collectTransformClasses(): TransformClassDict<Stored>;
}
