// import type { Chain, TransformClass } from "../../export.types.mjs";
// import type {
//   AstSourceString,
//   CommonTransportsConstructorParams,
//   IAstNode,
//   IAstNodeKind,
//   IAstNodeTransformCapability,
//   ISerializedNode,
//   IVerticesCapability,
// } from "../export.types.mjs";

// export interface ITrnCpsNode
//   extends IVerticesCapability<ITrnCpsNode>,
//     IAstNodeTransformCapability {
//   setChain(chain: Chain): this;
//   getKind(): IAstNodeKind;
//   setSource(s: AstSourceString): this;

//   // acceptsTransformClass(c: TransformClass): this;
//   // getAcceptedTransformClass(): [TransformClass, ITrnCpsNode];

//   // getRootAst(): IAstNode;

//   newChild(): ITrnCpsNode;
//   // transform(tcDict: TransformClassDict<IAstNode>, tc: TransformClass): this;
//   serialize(): ISerializedNode[];

//   setAst(ast: IAstNode): this;
//   getAst(): IAstNode;
// }

// export type ITrnCpsNodeConstructor = new (
//   s: CommonTransportsConstructorParams,
// ) => ITrnCpsNode;

// export interface ITrnCpsNodeAccepts {
//   node: ITrnCpsNode;
//   transformClass: TransformClass;
// }
