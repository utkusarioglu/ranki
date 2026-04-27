import type { ITCpxNode } from "@dqm/package-dqm-api-v2";
import { NodeFilter } from "../../common/node-filter/filter.mjs";
import type { TCpxNodeSanitizedTypesRecord } from "./tcpx.filter.types.mjs";
import { tryCatch } from "../../../export.mjs";

export class TCpxSanitizedFiltered extends NodeFilter<
  ITCpxNode,
  TCpxNodeSanitizedTypesRecord
> {
  protected calls = {
    tCpxEdges: () => this.recurse(this.node.getTCpxEdges()),
    // @ts-expect-error
    tCpsCount: () => tryCatch("tCpsCount", () => this.node.tCps.length),
  };
}
