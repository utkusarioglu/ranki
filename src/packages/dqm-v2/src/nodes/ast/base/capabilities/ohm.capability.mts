import type { CreatorName, AstSourceString } from "@dqm/package-dqm-api-v2";
import { assertExists } from "@dqm/package-dqm-utils";
import type * as ohm from "ohm-js";

export function ohmCapability<T>(self: T) {
  let ohm!: ohm.Node;
  return {
    getCreator(): CreatorName {
      assertExists(ohm.ctorName, { why: "Ohm needs to be defined" });
      return ohm.ctorName;
    },

    getStartIndex(): number {
      assertExists(ohm, { why: "Ohm needs to be defined" });
      return ohm.source.startIdx;
    },

    getEndIndex(): number {
      assertExists(ohm, { why: "Ohm needs to be defined" });
      return ohm.source.endIdx;
    },

    getSourceString(): AstSourceString {
      assertExists(ohm, { why: "Ohm needs to be defined" });
      return ohm.sourceString;
    },

    setOhmNode(n: ohm.Node): T {
      ohm = n;
      return self;
    },
  };
}
