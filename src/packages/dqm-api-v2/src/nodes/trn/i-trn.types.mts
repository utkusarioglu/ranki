import type { Chain, ChainString } from "../../export.types.mjs";
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
  SerializeMethodParams,
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
  extends
    ITrnNodeUnique,
    ForeignTrnEdges,
    LocalTrnEdges,
    Pick<IAstNodeTransformCapability, "getTransformClass"> {}

interface ITrnNodeUnique {
  readonly ast: IAstNode;
  readonly tCpx: ITCpxNode;
  readonly tCpsList: ITCpsNode[];

  transform(): Promise<this>;

  serialize(p: SerializeMethodParams): SerializedPackage;
  newChild(): ITrnNode;
  getAst(): IAstNode;
  getKind(): IAstNodeKind;

  setChain(c: Chain): this;
  // DECIDE this is only created for debugging purposes
  getChainString(): ChainString;

  setAsMount(): void;
  getIsMount(): boolean;

  setSource(s: AstSourceString): this;
  // DECIDE this is only created for debugging purposes
  getSource(): AstSourceString;
}

export type ITrnNodeConstructor = new (
  ast: IAstNode,
  tCpx: ITCpxNode,
  tCps: ITCpsNode,
  tCpsList: ITCpsNode[],
  s: CommonTransportsConstructorParams,
) => ITrnNode;
