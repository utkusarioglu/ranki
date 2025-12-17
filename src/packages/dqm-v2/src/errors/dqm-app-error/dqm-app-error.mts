import type {
  // IDqmErrorDetails,
  IDqmAppError,
  IDqmErrorBaseRequiredParams,
  // IDqmError,
  // IDqmErrorCause,
  WithCause,
} from "@dqm/package-dqm-api-v2";
import { DQM_APP_ERROR_CONSTANTS } from "./dqm-app-error.constants.mjs";
import { DqmBaseError } from "@dqm/package-dqm-utils";

export type DqmPluginErrorConstructorParams = WithCause &
  IDqmErrorBaseRequiredParams<keyof typeof DQM_APP_ERROR_CONSTANTS>;

// type ErrorStackEntry = string;

export class DqmAppError extends DqmBaseError implements IDqmAppError {
  public errorType: string = "DQM_APP";
  // public readonly why: string;
  // public readonly text: string;
  // public readonly details: IDqmErrorDetails;
  // public readonly cause: IDqmError | null;

  // constructor(p: DqmPluginErrorConstructorParams) {
  //   super(p.code, { cause: p.cause });
  //   this.cause = p.cause;
  //   this.why = p.why;
  //   this.text = DQM_APP_ERROR_CONSTANTS[p.code] || "(unregistered error code)";
  //   this.details = p.details || {};
  // }

  override getErrorText(code: keyof typeof DQM_APP_ERROR_CONSTANTS): string {
    return (
      DQM_APP_ERROR_CONSTANTS[code] || super.getDefaultErrorText(code)
      // `(${this.errorType} doesn't know this error code)`
    );
  }

  // toString() {
  //   return ["[DQM_APP|", this.message, "] ", this.text, " : ", this.why].join(
  //     "",
  //   );
  // }

  // toJSON() {
  //   return {
  //     why: this.why,
  //     code: this.message,
  //     text: this.text,
  //   };
  // }

  override getAdditionalExtendedDetails(): Record<string, any> {
    return {
      is: "App",
    };
  }

  override getAdditionalDetails(): Record<string, any> {
    return {};
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
  //     cause: this.cause ? this.cause.toExtendedJSON() : "(no cause)",
  //   };
  // }
}
