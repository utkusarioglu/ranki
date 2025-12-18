import type {
  IDqmError,
  IDqmErrorBaseRequiredParams,
  IDqmErrorCause,
  IDqmErrorDetails,
} from "@dqm/package-dqm-api-v2";

export type DqmPluginErrorConstructorParams = {
  cause: IDqmErrorCause;
} & IDqmErrorBaseRequiredParams<string>;

type ErrorStackEntry = string;

export abstract class DqmBaseError extends Error implements IDqmError {
  public abstract errorType: string;
  public readonly why: string;
  public readonly text: string;
  public readonly details: IDqmErrorDetails;
  public readonly cause: IDqmErrorCause;

  constructor(p: DqmPluginErrorConstructorParams) {
    super(p.code, { cause: p.cause });
    this.cause = p.cause;
    this.why = p.why;
    (this.text = this.getErrorText(p.code)), (this.details = p.details || {});
  }

  abstract getErrorText(code: string): string;

  protected getDefaultErrorText(code: string): string {
    return `(Error code ${code} is unknown to ${this.errorType})`;
  }

  protected getCause() {
    if (!this.cause) {
      return "(no defined cause)";
    }
    try {
      const methods = ["toExtendedJSON", "toJSON", "toString"];
      for (const method of methods) {
        // @ts-expect-error
        if (typeof this.cause[method] === "function") {
          // @ts-expect-error
          const call = this.cause[method]();

          switch (typeof call) {
            case "string":
              return {
                method,
                text: call,
              };
            default:
              return {
                method,
                ...call,
              };
          }
        }
      }
      return "(Depleted listed error serialization methods)";
      // throw new Error("Depleted listed error serialization methods");
    } catch (e) {
      const error = (e as any).hasOwnProperty("toString")
        ? (e as any).toString()
        : e;
      return {
        type: "error",
        text: "Cause determination ran into error",
        error,
      };
    }
  }

  toString() {
    return [
      "[",
      this.errorType,
      "|",
      this.message,
      "] ",
      this.text,
      " : ",
      this.why,
    ].join("");
  }

  toJSON() {
    return {
      producer: this.errorType,
      why: this.why,
      code: this.message,
      text: this.text,
    };
  }

  protected getStack() {
    let stack: ErrorStackEntry[] = ["(failed to build stack)"];
    try {
      stack = (this.stack || "")
        .split("\n")
        .slice(1)
        .map((v) => v.trim().slice(2).trim());
    } catch {
    } finally {
      return stack;
    }
  }

  abstract getAdditionalExtendedDetails(): Record<string, any>;
  abstract getAdditionalDetails(): Record<string, any>;

  toExtendedJSON() {
    return {
      ...this.toJSON(),
      ...this.getAdditionalExtendedDetails(),
      details: this.details,
      stack: this.getStack(),
      cause: this.getCause(),
    };
  }

  // constructor(code: string, objects: Objects) {
  //   super(ERROR_CODES[code] || `${code} (unregistered)`);
  //   this.code = code;
  //   this.objects = objects;
  // }

  // private stringifyObjects() {
  //   try {
  //     return JSON.stringify(this.objects, null, 2);
  //   } catch (e) {
  //     return "(Stringification failed)";
  //   }
  // }

  // toString() {
  //   return [
  //     "DQM ERROR:",
  //     this.message,
  //     "",
  //     "CODE:",
  //     this.code,
  //     "",
  //     "OBJECTS:",
  //     this.stringifyObjects(),
  //     "",
  //     "STACK:",
  //     this.stack,
  //   ].join("\n");
  // }

  // [Symbol.toPrimitive](hint: string) {
  //   if (hint === "string") {
  //     return this.toString();
  //   }
  //   return this.message;
  // }
}
