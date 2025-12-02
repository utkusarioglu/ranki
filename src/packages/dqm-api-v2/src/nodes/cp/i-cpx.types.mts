import type { CpxParseInput } from "../../dqm.types.mjs";
import type { ChainList } from "../../plugins/component/id/id.types.mjs";
import type { IAstNode, IParam } from "../../export.types.mjs";
import type { ICps } from "./i-cps.types.mjs";
import type { CommonTransportsConstructorParams } from "../common-transports.types.mjs";

export interface ICpx {
  setIdList(idList: ChainList): ICpx;
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
