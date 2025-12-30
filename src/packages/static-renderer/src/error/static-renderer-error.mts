import type {
  IDqmErrorBaseRequiredParams,
  IDqmRendererError,
  WithCause,
} from "@dqm/package-dqm-api-v2";
import { DQM_RENDERER_ERROR_CONSTANTS } from "./static-renderer-error.constants.mjs";
import { DqmBaseError } from "@dqm/package-dqm-utils";

export type DqmPluginErrorConstructorParams = WithCause &
  IDqmErrorBaseRequiredParams<keyof typeof DQM_RENDERER_ERROR_CONSTANTS>;

export class DqmRendererError
  extends DqmBaseError
  implements IDqmRendererError
{
  public errorType: string = "DQM_RENDERER";

  override getErrorText(
    code: keyof typeof DQM_RENDERER_ERROR_CONSTANTS,
  ): string {
    return (
      DQM_RENDERER_ERROR_CONSTANTS[code] || super.getDefaultErrorText(code)
    );
  }

  override getAdditionalExtendedDetails(): Record<string, any> {
    return {
      is: "Renderer",
    };
  }

  override getAdditionalDetails(): Record<string, any> {
    return {};
  }
}
