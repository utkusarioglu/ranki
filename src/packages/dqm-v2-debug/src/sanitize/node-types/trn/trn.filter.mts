import type { ITrnNode } from "@dqm/package-dqm-api-v2";
import { NodeFilter } from "../../common/node-filter/filter.mjs";
import type { ITrnNodeSanitizedTypesRecord } from "./trn.filter.types.mjs";

export class TrnSanitizedFiltered extends NodeFilter<
  ITrnNode,
  ITrnNodeSanitizedTypesRecord
> {
  protected calls = {
    kind: () => this.node.getKind(),
    transformClass: () => this.node.getTransformClass(),
    isMount: () => this.node.getIsMount(),
    localTrnEdges: () => this.recurse(this.node.getLocalTrnEdges()),
    foreignTrnEdges: () => this.recurse(this.node.getForeignTrnEdges()),
    source: () => this.node.getSource(),
    chainString: () => this.node.getChainString(),
  };
}
