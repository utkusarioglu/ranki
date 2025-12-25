import type { ICpx } from "@dqm/package-dqm-api-v2";
import { assertExists } from "@dqm/package-dqm-utils";

export function cpxCollection<T>(self: T) {
  let cpx: ICpx;

  return {
    setCpx(c: ICpx): T {
      cpx = c;
      return self;
    },

    getCpx(): ICpx {
      assertExists(cpx, { why: "Cps has to be tied to a Cpx" });
      return cpx;
    },
  };
}
