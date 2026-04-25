import type { ICpx } from "@dqm/package-dqm-api-v2";
import { NodeFilter } from "../../common/node-filter/filter.mjs";
import type { CpxNodeSanitizedTypesRecord } from "./cpx.filter.types.mjs";
import { tryCatchLeap } from "../../../export.mjs";

export class CpxSanitizedFiltered extends NodeFilter<
  ICpx,
  CpxNodeSanitizedTypesRecord
> {
  protected calls = {
    unique: () => this.node.getUnique(),
    chainListString: () => this.node.getChainListString(),
    cpxEdges: () => this.recurse(this.node.getCpxEdges()),

    cpsCount: () => tryCatchLeap(this.node.getCpsList(), (o) => o.length),
    rootAstSourceString: () =>
      tryCatchLeap(this.node.getRootAst(), (o) => o.getSourceString()),
  };
}
