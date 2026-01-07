import type { Chain } from "../../export.types.mjs";
import type {
  AstSourceString,
  CommonTransportsConstructorParams,
  IAstNode,
  IAstNodeKind,
  IAstNodeTransformCapability,
  IEdgeCapability,
  ITCpsNode,
  ITCpxNode,
  SerializedPackage,
} from "../export.types.mjs";

type ForeignTrnEdges = IEdgeCapability<
  ITrnNode,
  ITrnNode,
  "ForeignTrn",
  "setForeignTrnParent" | "getForeignTrnEdges" | "pushForeignTrnEdge"
>;

type LocalTrnEdges = IEdgeCapability<
  ITrnNode,
  ITrnNode,
  "LocalTrn",
  "setLocalTrnParent" | "getLocalTrnEdges" | "pushLocalTrnEdge"
>;

export interface ITrnNode
  extends ITrnNodeUnique,
    ForeignTrnEdges,
    LocalTrnEdges,
    Pick<IAstNodeTransformCapability, "getTransformClass"> {}

interface ITrnNodeUnique {
  readonly ast: IAstNode;
  readonly tCpx: ITCpxNode;
  readonly tCpsList: ITCpsNode[];

  transform(): this;

  serialize(): SerializedPackage;
  setSource(s: AstSourceString): this;
  newChild(): ITrnNode;
  getAst(): IAstNode;
  setChain(c: Chain): this;
  getKind(): IAstNodeKind;

  setAsMount(): void;
}

export type ITrnNodeConstructor = new (
  ast: IAstNode,
  tCpx: ITCpxNode,
  tCps: ITCpsNode[],
  s: CommonTransportsConstructorParams,
) => ITrnNode;
