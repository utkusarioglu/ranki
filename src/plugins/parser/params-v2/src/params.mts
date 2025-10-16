// import { RankiLanguageMergedConfig } from "../../../../packages/api/src/config.mjs";
import type {
  RankiLangAstContext,
  RankiLanguageConfig,
} from "@ranki/package-api-v2";
import type {
  ParamsV2Spec,
  ParamV2Key,
  ParamV2Operator,
  ParamV2Value,
} from "./types.mjs";

export interface CustomParamConvertFunctionReturn {
  path: string[]; // paths in config to crawl
  operator: ParamV2Operator;
  values: ParamV2Value[];
}

export type CustomParamConvertFunction = (
  index: number,
  key: ParamV2Key,
  operator: ParamV2Operator,
  values: ParamV2Value[],
) => CustomParamConvertFunctionReturn;

export function applyV2Directives(
  config: RankiLanguageConfig["merged"],
  directiveItems: ParamsV2Spec["items"],
  customCb: CustomParamConvertFunction,
) {
  const merged = JSON.parse(JSON.stringify(config));

  const assignDottedPath = (
    config: RankiLanguageConfig["merged"],
    path: string[],
    operator: ParamV2Operator,
    values: ParamV2Value[],
  ) => {
    try {
      let c = config;
      path.slice(0, -1).forEach((p) => {
        // @ts-expect-error
        c = c[p];
      });
      // @ts-expect-error
      const last: string = path.at(-1);
      switch (operator) {
        case "assign":
          const value = values.map((v) => v.value).join(" | ");

          // @ts-expect-error
          c[last] = value;
          break;
        default:
          throw new Error(`UNKNOWN OPERATOR: ${operator}`);
      }
    } catch (e) {
      console.error(e, path);
    }
  };

  directiveItems.forEach(({ key, operator, values }, index) => {
    if (key === "positional") {
      throw new Error("DIRECTIVES CANNOT BE POSITIONAL");
    }
    // const path = key.split(".");
    if (key.length > 1) {
      assignDottedPath(merged, key, operator, values);
    } else {
      const converted = customCb(index, key, operator, values);
      assignDottedPath(
        merged,
        converted.path,
        converted.operator,
        converted.values,
      );
    }
  });

  return merged;
}
