import type { CpxParseInput } from "../../dqm.types.mjs";
import type {
  IAstNode,
  IAstParamNode,
  IVerticesCapability,
} from "../export.types.mjs";
import type { ICpx } from "./i-cpx.types.mjs";
import type { CommonTransportsConstructorParams } from "../common-transports.types.mjs";
import type { CpsDefinition } from "../../plugins/component/component.types.mjs";
import type { IId } from "../../plugins/component/id/id.types.mjs";

export interface ICps
  extends ICpsIdCapability,
    ICpsOther,
    IVerticesCapability<ICps> {}

export interface ICpsOther {
  setDefinition(def: CpsDefinition): this;

  getParams(): IAstParamNode[];

  setCpx(cpx: ICpx): this;
  getCpx(): ICpx;

  parse(input: CpxParseInput): IAstNode;
  getOnFailMode(): boolean;

  // getId(): IId;
  // getId(): Alias | Chain;
  // getIdString(): AliasString | ChainString
  // getAliasString(): AliasString

  // setParent(cps: ICps | null): this;
  // getParent(): ICps | null;
  // setPrev(prev: ICps): this;
  // setNext(next: ICps): this;
  // getPrev(): ICps | null;
  // getNext(): ICps | null;
  // pushChild(child: ICps): this;
  // getChildren(): ICps[];
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
