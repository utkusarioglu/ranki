import type {
  // IDqmErrorDetails,
  IAstNode,
  IDqmPluginError,
  IDqmErrorBaseRequiredParams,
  // IDqmErrorCause,
  WithCause,
} from "@dqm/package-dqm-api-v2";
import { DQM_PLUGIN_ERROR_CODES } from "@dqm/package-dqm-api-v2/constants";
import { DqmBaseError } from "@dqm/package-dqm-utils";

export type DqmPluginErrorConstructorParams = WithCause & {
  ast: IAstNode;
} & IDqmErrorBaseRequiredParams<keyof typeof DQM_PLUGIN_ERROR_CODES>;

// type ErrorStackEntry = string;

export class DqmPluginError extends DqmBaseError implements IDqmPluginError {
  public errorType: string = "DQM_PLUGIN";
  // public readonly why: string;
  // public readonly text: string;
  private readonly ast: IAstNode;
  // public readonly cause: IDqmErrorCause;
  // public readonly details: IDqmErrorDetails;

  constructor(p: DqmPluginErrorConstructorParams) {
    super(p);
    // super(p.code, { cause: p.cause });
    // this.cause = p.cause;
    this.ast = p.ast;
    // this.why = p.why;
    // this.text = DQM_PLUGIN_ERROR_CODES[p.code] || "(unregistered error code)";
    // this.details = p.details || {};
  }

  override getErrorText(code: keyof typeof DQM_PLUGIN_ERROR_CODES): string {
    return DQM_PLUGIN_ERROR_CODES[code] || super.getDefaultErrorText(code);
  }
  // toString() {
  //   return [
  //     "[DQM_PLUGIN|",
  //     this.message,
  //     "] ",
  //     this.text,
  //     " : ",
  //     this.why,
  //   ].join("");
  // }

  // toJSON() {
  //   let chainListString = "(failed to determine)";
  //   try {
  //     chainListString = this.ast
  //       .getCpx()
  //       .getIdList()
  //       .map((v) => v.join("."))
  //       .join(" | ");
  //   } catch (e) {}

  //   return {
  //     chainListString,
  //     why: this.why,
  //     code: this.message,
  //     text: this.text,
  //   };
  // }

  override getAdditionalDetails(): Record<string, any> {
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
    };
  }

  override getAdditionalExtendedDetails(): Record<string, any> {
    return {
      is: "Plugin",
    };
  }

  // toExtendedJSON() {
  //   let stack: ErrorStackEntry[] = ["(failed to build stack)"];
  //   try {
  //     stack = (this.stack || "")
  //       .split("\n")
  //       .slice(1)
  //       .map((v) => v.trim().slice(2).trim());
  //   } catch {}
  //   return {
  //     ...this.toJSON(),
  //     details: this.details,
  //     stack,
  //     cause: this.cause ? this.cause.toDetailedJSON() : "(no cause)",
  //   };
  // }
}
