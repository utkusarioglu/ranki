import type { CpxParseInput } from "../../dqm.types.mjs";
import type { IAstNode, IParam } from "../export.types.mjs";
import type { ICpx } from "./i-cpx.types.mjs";
import type { CommonTransportsConstructorParams } from "../common-transports.types.mjs";
import type { CpsDefinition } from "../../plugins/component/component.types.mjs";
import type { IId } from "../../plugins/component/id/id.types.mjs";

export interface ICps {
  setParent(cps: ICps | null): this;
  getParent(): ICps | null;

  setPrev(prev: ICps): this;
  setNext(next: ICps): this;
  getPrev(): ICps | null;
  getNext(): ICps | null;

  setDefinition(def: CpsDefinition): this;

  getParams(): IParam[];

  setCpx(cpx: ICpx): this;

  getId(): IId;

  getCpx(): ICpx;

  parse(input: CpxParseInput): IAstNode;

  pushChild(child: ICps): this;
  getChildren(): ICps[];

  getOnFailMode(): boolean;
}

export type ICpsConstructor = new (
  transports: CommonTransportsConstructorParams,
) => ICpx;
