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
import type { IAstParamNode } from "../ast/export.types.mjs";
import type {
  IAstNode,
  UniqueValue,
  IVerticesCapability,
} from "../../export.types.mjs";

export type ICpxConstructor = new (
  transports: CommonTransportsConstructorParams,
) => ICpx;

export interface ICpx
  extends Other,
    IdListCapability,
    IVerticesCapability<ICpx>,
    UniquenessCapability,
    RawParamsCapability,
    CollectionCapability {}
interface Other {
  parse(input: CpxParseInput): IAstNode;
}

export interface CollectionCapability {
  getLeafCps(): ICps;
  getRootCps(): ICps;
  getCpsList(): ICps[];
  setRootAst(ast: IAstNode): this;
  getRootAst(): IAstNode;
}

export interface RawParamsCapability {
  setRawParams(params: IAstParamNode[]): this;
  getRawParams(): IAstParamNode[] | null;
}

export interface UniquenessCapability {
  getUnique(): UniqueValue;
}

export interface IdListCapability {
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
}
