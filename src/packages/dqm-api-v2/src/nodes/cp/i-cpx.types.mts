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
import type { IAstNode } from "../ast/ast-node.types.mjs";
import type { IParam } from "../param/param-node.types.mjs";
import type { UniqueValue } from "../../export.types.mjs";

export type ICpxConstructor = new (
  transports: CommonTransportsConstructorParams,
) => ICpx;

export interface ICpx {
  getUnique(): UniqueValue;

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
  setParent(cpx: ICpx | null): this;
  getParent(): ICpx | null;

  setPrev(prev: ICpx): this;
  setNext(next: ICpx): this;
  getPrev(): ICpx | null;
  getNext(): ICpx | null;

  pushChild(cpx: ICpx): this;
  getChildren(): ICpx[];

  parse(input: CpxParseInput): IAstNode;
  setRawParams(params: IParam[]): this;
  getRawParams(): IParam[] | null;
  getLeafCps(): ICps;
  getRootCps(): ICps;
  getCpsList(): ICps[];

  setRootAst(ast: IAstNode): this;
  getRootAst(): IAstNode;
}
