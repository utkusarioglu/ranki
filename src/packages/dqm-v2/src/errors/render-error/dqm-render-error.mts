import type {
  IDqmPluginError,
  IDqmErrorBaseRequiredParams,
  WithCause,
  // ISerializedNode,
} from "@dqm/package-dqm-api-v2";
import { DQM_PLUGIN_ERROR_CODES } from "@dqm/package-dqm-api-v2/constants";
import { DqmBaseError } from "@dqm/package-dqm-utils";

export type DqmRenderErrorConstructorParams = WithCause & {
  // trn: ISerializedNode;
} & IDqmErrorBaseRequiredParams<keyof typeof DQM_PLUGIN_ERROR_CODES>;

export class DqmRenderError extends DqmBaseError implements IDqmPluginError {
  public errorType: string = "DQM_RENDER";
  // private readonly trn: ISerializedNode;

  constructor(p: DqmRenderErrorConstructorParams) {
    super(p);
    // this.trn = p.trn;
  }

  override getErrorText(code: keyof typeof DQM_PLUGIN_ERROR_CODES): string {
    return DQM_PLUGIN_ERROR_CODES[code] || super.getDefaultErrorText(code);
  }

  override getAdditionalDetails(): Record<string, any> {
    // let chainListString = "(failed to determine)";
    // try {
    //   // chainListString = this.trn.chain.join(".");
    // } catch (e) {}
    return {
      // chainListString,
    };
  }

  override getAdditionalExtendedDetails(): Record<string, any> {
    return {
      is: "RenderPlugin",
    };
  }
}
