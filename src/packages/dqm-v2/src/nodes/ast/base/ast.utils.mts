import type {
  IAstNode,
  IDqmPluginErrorCode,
  IDqmErrorBaseRequiredParams,
} from "@dqm/package-dqm-api-v2";
import { POSITIONAL_PARAM } from "../../../constants.mjs";
import { DqmPluginError } from "../../../errors/plugin-error/dqm-plugin-error.mjs";

/**
 *
 * @param ast IAstNode at the point where the context is needed. It doesn't have to be a parse boundary. Every ohm node will needs this.
 * @returns The context param definition specified at the ohm parse operation.
 */
export function prepareContext(ast: IAstNode) {
  const error = (p: IDqmErrorBaseRequiredParams<IDqmPluginErrorCode>) => {
    return new DqmPluginError({
      ...p,
      ast,
      cause: null,
    });
  };

  // const exists = (value: any, why: string, details = {}) => {
  //   if (value === undefined) {
  //     throw error({ code: "ASSERT_EXISTS", why, details });
  //   }
  // };

  return {
    ast,
    constants: {
      POSITIONAL_PARAM,
    },
    callbacks: {
      err: {
        error,
      },
      // assert: {
      //   exists,
      // },
    },
  };
}
