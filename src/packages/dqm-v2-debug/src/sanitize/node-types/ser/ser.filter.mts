import type { ISerializedNode } from "@dqm/package-dqm-api-v2";
import { NodeFilter } from "../../common/node-filter/filter.mjs";
import type { SerNodeSanitizedTypesRecord } from "./ser.filter.types.mjs";

export class SerSanitizedFiltered extends NodeFilter<
  ISerializedNode,
  SerNodeSanitizedTypesRecord
> {
  protected calls = {
    key: () => this.node.key,
    chain: () => this.node.chain,
    props: () => this.node.props,
    kind: () => this.node.kind,
    // @ts-expect-error
    source: () => this.node.source,

    children: () =>
      this.recurse(
        // @ts-expect-error
        { value: this.node.children || [] },
      ),
  };
}
