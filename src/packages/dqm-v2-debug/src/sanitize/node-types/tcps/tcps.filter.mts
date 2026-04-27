import type { ITCpsNode } from "@dqm/package-dqm-api-v2";
import { NodeFilter } from "../../common/node-filter/filter.mjs";
import type { TCpsNodeSanitizedTypesRecord } from "./tcps.filter.types.mjs";

export class TCpsSanitizedFiltered extends NodeFilter<
  ITCpsNode,
  TCpsNodeSanitizedTypesRecord
> {
  protected calls = {
    tCpsEdges: () => this.recurse(this.node.getTCpsEdges()),
  };
}
