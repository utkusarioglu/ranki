import type { IAstNode, ICpx } from "@dqm/package-dqm-api-v2";

export class AstNode implements IAstNode {
  private cpx: ICpx;

  newCpx(f: (cpx: ICpx) => ICpx): IAstNode {
    const newCpx = new Cpx();
  }
}
