import type { CpxParseInput } from "../../dqm.types.mjs";
import type { IAstNode, IAstParamNode } from "../export.types.mjs";
import type { ICpx } from "./i-cpx.types.mjs";
import type { CommonTransportsConstructorParams } from "../common-transports.types.mjs";
import type { CpsDefinition } from "../../plugins/component/component.types.mjs";
import type { IId } from "../../plugins/component/id/id.types.mjs";

export type ICps = ICpsIdCapability & ICpsOther;
export interface ICpsOther {
  setParent(cps: ICps | null): this;
  getParent(): ICps | null;

  setPrev(prev: ICps): this;
  setNext(next: ICps): this;
  getPrev(): ICps | null;
  getNext(): ICps | null;

  setDefinition(def: CpsDefinition): this;

  getParams(): IAstParamNode[];

  setCpx(cpx: ICpx): this;

  // getId(): IId;
  // getId(): Alias | Chain;
  // getIdString(): AliasString | ChainString
  // getAliasString(): AliasString

  getCpx(): ICpx;

  parse(input: CpxParseInput): IAstNode;

  pushChild(child: ICps): this;
  getChildren(): ICps[];

  getOnFailMode(): boolean;
}

export type ICpsIdCapability = Pick<
  IId,
  | "getId"
  | "getIdString"
  | "getAlias"
  | "getAliasString"
  | "getChain"
  | "getChainString"
>;

export type ICpsConstructor = new (
  transports: CommonTransportsConstructorParams,
) => ICpx;
