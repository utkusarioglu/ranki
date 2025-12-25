import type { IAstParamNode } from "@dqm/package-dqm-api-v2";

export function rawParamCapability<T>(self: T) {
  let rawParam: IAstParamNode | null = null;

  return {
    setRawParam(rawParam: IAstParamNode): T {
      rawParam = rawParam;
      return self;
    },

    getRawParam(): T | null {
      return rawParam;
    },
  };
}
