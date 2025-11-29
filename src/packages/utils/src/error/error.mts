import { ERROR_CODES } from "./constants.mjs";
import type { Objects } from "./error.types.mjs";

export class DqmError extends Error {
  private objects: Objects;
  private code: string;

  constructor(code: string, objects: Objects) {
    super(ERROR_CODES[code] || `!!!ERROR CODE NOT REGISTERED: "${code}"!!!`);
    this.code = code;
    this.objects = objects;
  }

  toString() {
    return [
      "DQM ERROR:",
      this.message,
      "",
      "CODE:",
      this.code,
      "",
      "OBJECTS:",
      JSON.stringify(this.objects, null, 2),
      "",
      "STACK:",
      this.stack,
    ].join("\n");
  }

  [Symbol.toPrimitive](hint: string) {
    if (hint === "string") {
      return this.toString();
    }
    return this.message;
  }
}
