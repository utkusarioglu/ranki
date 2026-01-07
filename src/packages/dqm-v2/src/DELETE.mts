import type { ISerializedNode } from "@dqm/package-dqm-api-v2";

// @ts-ignore
const DUMMY_SERIALIZATION: ISerializedNode[] = [
  {
    kind: "leaf",
    chain: ["debug", "leaf", "container"],
    // @ts-expect-error
    dqm: {},
    component: {},
    source: "(temp trn serialization)",
  },
];
