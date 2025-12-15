import type {
  DqmPluginErrorCode,
  IAstNode,
  IDqmPluginErrorRequiredParams,
} from "@dqm/package-dqm-api-v2";
import { DQM_PLUGIN_ERROR_CODES } from "@dqm/package-dqm-api-v2/constants";

export type DqmPluginErrorConstructorParams = {
  ast: IAstNode;
  cause: Error | null;
} & IDqmPluginErrorRequiredParams;

export class DqmPluginError extends Error {
  private why: string;
  private errorCode: DqmPluginErrorCode;
  private errorMessage: string;
  private ast: IAstNode;

  constructor(p: DqmPluginErrorConstructorParams) {
    super(p.code, {
      cause: p.cause || null,
    });
    this.ast = p.ast;
    this.why = p.why;
    this.errorCode = p.code;
    this.errorMessage = this.getErrorMessage(p.code);
  }

  private getErrorMessage(errorCode: DqmPluginErrorCode): string {
    const message = DQM_PLUGIN_ERROR_CODES[errorCode];
    return message !== undefined ? message : "(unregistered)";
  }

  toString() {
    return JSON.stringify({
      chainListString: this.ast
        .getCpx()
        .getIdList()
        .map((v) => v.join("."))
        .join(" | "),
      why: this.why,
      errorCode: this.errorCode,
      errorMessage: this.errorMessage,
      stack: this.stack,
    });
  }
}
