import type {
  Alias,
  Chain,
  IAstParamSpecsCapability,
  ICpsParamValue,
  IId,
  ParamDefaultValue,
} from "../../export.types.mjs";
import type { IAstParamCapability } from "../ast/capabilities/raw-param.cap.types.mjs";
import type { AstSourceView } from "../export.types.mjs";
// import type { RawParamsCapability } from "./export.types.mjs";

export interface ICpsParam
  extends ICpsParamIdCapability,
    CpsParamValuesCapability,
    IAstParamCapability<ICpsParam>,
    IAstParamSpecsCapability {
  //
}

export interface CpsParamValuesCapability {
  // setValues(values: AstSourceView[]): this;
  getAstValues(): AstSourceView[] | null;

  getMergedValues(): ICpsParamValue;

  setDefaultValues(valueSpec: ParamDefaultValue[]): this;
  getDefaultValues(): ParamDefaultValue[];
}

export interface ICpsParamIdCapability
  extends Pick<
    IId,
    | "getId"
    | "getIdString"
    | "getAlias"
    | "getAliasString"
    | "getChain"
    | "getChainString"
    | "setAlias"
    | "setPosition"
  > {
  setId(id: Alias | Chain): this;
}
