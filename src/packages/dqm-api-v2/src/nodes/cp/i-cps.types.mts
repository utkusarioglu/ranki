import type { CpxParseInput } from "../../dqm.types.mjs";
import type { CpsDefinition } from "../../export.types.mjs";
import type { IAstNode } from "../export.types.mjs";
import type { ICpx } from "./i-cpx.types.mjs";
import type { CommonTransportsConstructorParams } from "../common-transports.types.mjs";

export interface ICps {
  setParent(cps: ICps | null): ICps;
  setDefinition(def: CpsDefinition): ICps;
  setCpx(cpx: ICpx): ICps;
  // getConfig(): IConfig;

  getCpx(): ICpx;

  parse(input: CpxParseInput): IAstNode;
}

export type ICpsConstructor = new (
  transports: CommonTransportsConstructorParams,
) => ICpx;
