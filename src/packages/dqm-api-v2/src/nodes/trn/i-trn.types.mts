import type { Chain } from "../../export.types.mjs";
import type {
  AstSourceString,
  CommonTransportsConstructorParams,
  IAstNode,
  IAstNodeKind,
  IAstNodeTransformCapability,
  ISerializedNode,
  ITCpsNode,
  ITCpxNode,
  IVerticesCapability,
  // TransformClass,
} from "../export.types.mjs";

export interface ITrnNode
  extends ITrnNodeUnique,
    Pick<IVerticesCapability<ITrnNode>, "setParent" | "getChildren">,
    Pick<IAstNodeTransformCapability, "getTransformClass"> {}

interface ITrnNodeUnique {
  readonly ast: IAstNode;
  readonly tCpx: ITCpxNode;
  readonly tCpsList: ITCpsNode[];

  transform(): this;

  serialize(): ISerializedNode[];
  setSource(s: AstSourceString): this;
  newChild(): ITrnNode;
  getAst(): IAstNode;
  setChain(c: Chain): this;
  getKind(): IAstNodeKind;
  setSlot(): this;
  getSlot(): ITrnNode;
}

export type ITrnNodeConstructor = new (
  ast: IAstNode,
  tCpx: ITCpxNode,
  tCps: ITCpsNode[],
  s: CommonTransportsConstructorParams,
) => ITrnNode;
