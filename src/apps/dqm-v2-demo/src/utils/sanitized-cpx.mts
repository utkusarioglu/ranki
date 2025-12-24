import type { ICpx } from "@dqm/package-dqm-api-v2";

export class SanitizedCpx implements ICpx {
  private cpx: ICpx;

  constructor(cpx: ICpx) {
    this.cpx = cpx;
  }
}
