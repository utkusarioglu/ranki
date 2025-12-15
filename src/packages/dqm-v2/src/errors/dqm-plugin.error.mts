import type {
  IDqmPluginErrorCode,
  IDqmErrorDetails,
  IAstNode,
  IDqmPluginError,
  IDqmPluginRequiredParams,
} from "@dqm/package-dqm-api-v2";
import { DQM_PLUGIN_ERROR_CODES } from "@dqm/package-dqm-api-v2/constants";

export type DqmPluginErrorConstructorParams = {
  ast: IAstNode;
  cause: Error | unknown;
} & IDqmPluginRequiredParams;

type ErrorStackEntry = string;

export class DqmPluginError extends Error implements IDqmPluginError {
  public readonly why: string;
  public readonly code: IDqmPluginErrorCode;
  private readonly ast: IAstNode;
  public readonly details: IDqmErrorDetails;

  constructor(p: DqmPluginErrorConstructorParams) {
    const message = DQM_PLUGIN_ERROR_CODES[p.code] || "(unregistered)";
    super(message, { cause: p.cause });
    this.cause = p.cause;
    this.ast = p.ast;
    this.why = p.why;
    this.code = p.code;
    this.details = p.details || {};
  }

  toString() {
    return [
      "[DQM_PLUGIN|",
      this.code,
      "] ",
      this.message,
      " : ",
      this.why,
    ].join("");
  }

  toJSON() {
    let chainListString = "(failed to determine)";
    try {
      chainListString = this.ast
        .getCpx()
        .getIdList()
        .map((v) => v.join("."))
        .join(" | ");
    } catch (e) {}

    return {
      chainListString,
      why: this.why,
      code: this.code,
      message: this.message,
    };
  }

  toDetailedJSON() {
    let stack: ErrorStackEntry[] = ["(failed to build stack)"];
    try {
      stack = (this.stack || "")
        .split("\n")
        .slice(1)
        .map((v) => v.trim().slice(2).trim());
    } catch {}
    return {
      ...this.toJSON(),
      details: this.details,
      stack,
    };
  }
}
