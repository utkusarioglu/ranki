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
  setIdList(idList: ChainList): this;
  getChainList(): ChainList;
  getIdList(): IdList;
  setParent(cpx: ICpx): this;
  getParent(): ICpx;
  pushChild(cpx: ICpx): this;
  getChildren(): ICpx[];

  parse(input: CpxParseInput): IAstNode;
  setParams(params: IParam[]): this;
  getLeafCps(): ICps;
  getRootCps(): ICps;
  getCpsList(): ICps[];

  setRootAst(ast: IAstNode): this;
  getRootAst(): IAstNode;
}

export type ICpxConstructor = new (
  transports: CommonTransportsConstructorParams,
) => ICpx;
