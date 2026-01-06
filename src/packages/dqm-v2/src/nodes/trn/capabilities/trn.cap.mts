import type { ITrnNode } from "@dqm/package-dqm-api-v2";
import { assertExists } from "../../../errors/dqm-app-error/assertions.mjs";

export function trnCapability<T>(self: T) {
  let trn: ITrnNode[] | null = null;

  return {
    assignTrn(t: ITrnNode[]): T {
      if (trn === null) {
        trn = t;
      }
      return self;
    },

    getTrn(): ITrnNode[] {
      assertExists(trn, { why: "Trn nodes must be set" });
      return trn;
    },
  };
}
