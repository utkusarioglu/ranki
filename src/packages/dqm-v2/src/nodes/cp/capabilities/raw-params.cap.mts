import type { Audience, IAstParamNode } from "@dqm/package-dqm-api-v2";
import { ALL_AUDIENCES } from "../../ast/param/param.constants.mjs";
import { assertExists } from "@dqm/package-dqm-utils";

export function rawParamsCapability<T>(self: T) {
  let rawParams: IAstParamNode[];

  return {
    setRawParams(params: IAstParamNode[]): T {
      rawParams = params;
      return self;
    },

    getRawParamsByAudience(audience: Audience): IAstParamNode[] {
      assertExists(rawParams, {
        why: "Calling raw params when it's not expected may be a architectural issue",
      });
      return rawParams.filter((p) =>
        [ALL_AUDIENCES, audience].includes(p.getAudience()),
      );
    },

    getRawParams(): IAstParamNode[] | null {
      return rawParams;
    },
  };
}
