import type { ICps } from "@dqm/package-dqm-api-v2";
import { NodeFilter } from "../../common/node-filter/filter.mjs";
import type { CpsNodeSanitizedTypesRecord } from "./cps.filter.types.mjs";

export class CpsSanitizedFiltered extends NodeFilter<
  ICps,
  CpsNodeSanitizedTypesRecord
> {
  protected calls = {
    unique: () => this.node.getUnique(),
    cpsEdges: () => this.recurse(this.node.getCpsEdges()),
    settledId: () => this.node.getSettledId(),
  };
}
