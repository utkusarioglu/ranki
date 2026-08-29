import type {
  IDqmConfigError,
  // IDqmErrorCause,
  // IDqmErrorDetails,
  IDqmErrorBaseRequiredParams,
  WithCause,
} from "@dqm/package-dqm-api-v2";
import { DQM_CONFIG_ERROR_CODES } from "./error.constants.mjs";
import { DqmBaseError } from "@dqm/package-dqm-utils";

export type DqmPluginErrorConstructorParams = WithCause &
  IDqmErrorBaseRequiredParams<keyof typeof DQM_CONFIG_ERROR_CODES>;

// type ErrorStackEntry = string;

export class DqmConfigError extends DqmBaseError implements IDqmConfigError {
  public errorType: string = "DQM_CONFIG";
  // public readonly why: string;
  // public readonly text: string;
  // public readonly cause: IDqmErrorCause;
  // private readonly ast: IAstNode;
  // public readonly details: IDqmErrorDetails;

  // constructor(p: DqmPluginErrorConstructorParams) {
  //   super(p.code, { cause: p.cause });
  //   this.cause = p.cause;
  //   // this.ast = p.ast;
  //   this.why = p.why;
  //   this.text = DQM_CONFIG_ERROR_CODES[p.code] || "(unregistered error code)";
  //   this.details = p.details || {};
  // }

  override getErrorText(code: keyof typeof DQM_CONFIG_ERROR_CODES): string {
    return DQM_CONFIG_ERROR_CODES[code] || super.getDefaultErrorText(code);
  }

  override getAdditionalExtendedDetails(): Record<string, any> {
    return {
      is: "Config error extended",
    };
  }

  override getAdditionalDetails(): Record<string, any> {
    return {
      isBasic: "basic config details",
    };
  }

  // toString() {
  //   return [
  //     "[DQM_CONFIG|",
  //     this.message,
  //     "] ",
  //     this.text,
  //     " : ",
  //     this.why,
  //   ].join("");
  // }

  // toJSON() {
  //   // let chainListString = "(failed to determine)";
  //   // try {
  //   //   chainListString = this.ast
  //   //     .getCpx()
  //   //     .getIdList()
  //   //     .map((v) => v.join("."))
  //   //     .join(" | ");
  //   // } catch (e) {}

  //   return {
  //     why: this.why,
  //     code: this.message,
  //     text: this.text,
  //   };
  // }

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
