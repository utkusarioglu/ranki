import type { CpxParseInput } from "../../dqm.types.mjs";
import type {
  ChainList,
  IdList,
  IId,
} from "../../plugins/component/id/id.types.mjs";
import type { ICps } from "./i-cps.types.mjs";
import type { CommonTransportsConstructorParams } from "../common-transports.types.mjs";
import type { IAstNode } from "../ast/ast-node.types.mjs";
import type { IParam } from "../param/param-node.types.mjs";

export interface ICpx {
  getId(): IId;
  setIdList(idList: ChainList): ICpx;
  getChainList(): ChainList;
  getIdList(): IdList;
  setParent(cpx: ICpx): ICpx;
  getParent(): ICpx;
  parse(input: CpxParseInput): IAstNode;
  setParams(params: IParam[]): ICpx;
  getLeafCps(): ICps;
  getRootCps(): ICps;

  setRootAst(ast: IAstNode): ICpx;
  getRootAst(): IAstNode;
}

export type ICpxConstructor = new (
  transports: CommonTransportsConstructorParams,
) => ICpx;
