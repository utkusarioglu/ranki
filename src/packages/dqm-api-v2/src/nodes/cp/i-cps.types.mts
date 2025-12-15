import type { CpxParseInput } from "../../dqm.types.mjs";
import type { IAstNode } from "../export.types.mjs";
import type { ICpx } from "./i-cpx.types.mjs";
import type { CommonTransportsConstructorParams } from "../common-transports.types.mjs";
import type { CpsDefinition } from "../../plugins/component/component.types.mjs";
import type { IId } from "../../plugins/component/id/id.types.mjs";

export interface ICps {
  setParent(cps: ICps | null): ICps;
  setDefinition(def: CpsDefinition): ICps;
  setCpx(cpx: ICpx): ICps;

  getId(): IId;

  getCpx(): ICpx;

  parse(input: CpxParseInput): IAstNode;
}

export type ICpsConstructor = new (
  transports: CommonTransportsConstructorParams,
) => ICpx;
