import type { Chain, TransformClass } from "../../export.types.mjs";
import type {
  AstSourceString,
  CommonTransportsConstructorParams,
  IAstNode,
  IAstNodeKind,
  ISerializedNode,
  IVerticesCapability,
} from "../export.types.mjs";

export interface ITrnCpsNode extends IVerticesCapability<ITrnCpsNode> {
  setChain(chain: Chain): this;
  getKind(): IAstNodeKind;
  setSource(s: AstSourceString): this;

  accepts(c: TransformClass): this;

  getRootAst(): IAstNode;

  newChild(): ITrnCpsNode;
  transform(): ITrnCpsNode;
  serialize(): ISerializedNode[];

  // setTransformClass(t: TransformClass): this;
  // getTransformClass(): TransformClass;
}

export type ITrnCpsNodeConstructor = new (
  s: CommonTransportsConstructorParams,
) => ITrnCpsNode;

export interface ITrnCpsNodeAccepts {
  node: ITrnCpsNode;
  transformClass: TransformClass;
}
