import type {
  IAstNode,
  IDqmPluginErrorRequiredParams,
} from "@dqm/package-dqm-api-v2";
import { POSITIONAL_PARAM } from "../../constants.mjs";
import { DqmPluginError } from "../../errors/dqm-plugin.error.mjs";

/**
 *
 * @param ast IAstNode at the point where the context is needed. It doesn't have to be a parse boundary. Every ohm node will needs this.
 * @returns The context param definition specified at the ohm parse operation.
 */
export function prepareContext(ast: IAstNode) {
  return {
    ast,
    constants: {
      POSITIONAL_PARAM,
    },
    callbacks: {
      error: (p: IDqmPluginErrorRequiredParams) => {
        throw new DqmPluginError({
          ...p,
          ast,
          cause: null,
        });
      },
    },
  };
}
