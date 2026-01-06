import type { CpxParseInput } from "../../dqm.types.mjs";
import type {
  AliasList,
  ChainList,
  ChainListString,
  ChainStringList,
  IdList,
  IdListString,
  IdStringList,
} from "../../plugins/component/id/id.types.mjs";
import type { ICps } from "./i-cps.types.mjs";
import type { CommonTransportsConstructorParams } from "../common-transports.types.mjs";
import type { IAstParamNode, IEdgeCapability } from "../ast/export.types.mjs";
import type {
  IAstNode,
  Audience,
  ICommonTransports,
} from "../../export.types.mjs";

export type ICpxConstructor = new (
  transports: CommonTransportsConstructorParams,
) => ICpx;

type ICpxEdges = IEdgeCapability<
  ICpx,
  ICpx,
  "Cpx",
  | "getCpxEdges"
  | "setCpxParent"
  | "getCpxParent"
  | "getCpxPrev"
  | "pushCpxEdge"
  | "setCpxPrev"
>;

export interface ICpx
  extends ICommonTransports,
    ICpxUniqueCapability,
    // IVerticesCapability<ICpx>,
    ICpxEdges,
    RawParamsCapability,
    CpsCollectionCapability,
    AstCollectionCapability {}
interface ICpxUniqueCapability {
  parse(input: CpxParseInput): IAstNode;
}

export interface CpsCollectionCapability {
  getIdStringList(): IdStringList;
  getIdListString(): IdListString;

  setIdList(idList: ChainList): this;

  /**
   * No AliasStringList and no AliasListString because alias for the cps can be
   * undefined.
   */
  getAliasList(): AliasList;

  getChainList(): ChainList;
  getChainStringList(): ChainStringList;
  getChainListString(): ChainListString;

  getIdList(): IdList;

  getLeafCps(): ICps;
  getRootCps(): ICps;
  getCpsList(): ICps[];
  setTargetCps(cps: ICps): this;
  getTargetCps(): ICps;
}

export interface AstCollectionCapability {
  setRootAst(ast: IAstNode): this;
  getRootAst(): IAstNode;
}

export interface RawParamsCapability {
  setAstParams(params: IAstParamNode[]): this;
  getAstParams(): IAstParamNode[] | null;
  getAstParamsByAudience(audience: Audience): IAstParamNode[];
}
