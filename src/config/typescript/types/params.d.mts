import type { RankiLanguageConfig } from "@ranki/package-api-v2";
import type { ParamsV2Spec, ParamV2Key, ParamV2Operator, ParamV2Value } from "./types.mjs";
export interface CustomParamConvertFunctionReturn {
    path: string[];
    operator: ParamV2Operator;
    values: ParamV2Value[];
}
export type CustomParamConvertFunction = (index: number, key: ParamV2Key, operator: ParamV2Operator, values: ParamV2Value[]) => CustomParamConvertFunctionReturn;
export declare function applyV2Directives(config: RankiLanguageConfig["merged"], directiveItems: ParamsV2Spec["items"], customCb: CustomParamConvertFunction): any;
