import type { Audience, IAstParamNode } from "@dqm/package-dqm-api-v2";
import { ALL_AUDIENCES } from "../../ast/param/param.constants.mjs";
import { assertExists } from "@dqm/package-dqm-utils";

export function astParamsCapability<T>(self: T) {
  let astParams: IAstParamNode[];

  return {
    setAstParams(params: IAstParamNode[]): T {
      astParams = params;
      return self;
    },

    getAstParamsByAudience(audience: Audience): IAstParamNode[] {
      assertExists(astParams, {
        why: "Calling raw params when it's not expected may be a architectural issue",
      });
      return astParams.filter((p) =>
        [ALL_AUDIENCES, audience].includes(p.getAudience()),
      );
    },

    getAstParams(): IAstParamNode[] | null {
      return astParams;
    },
  };
}
