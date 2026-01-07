import type { Chain, DqmConfig } from "../../export.types.mjs";

export interface SerializedPackage {
  serialized: ISerializedNode[];
  mount?: (c: ISerializedNode[]) => void | undefined;
}

export type ISerializedNode = ISerializedParent | ISerializedLeaf;

interface ISerializedCommon {
  chain: Chain;
  data: {
    dqm: DqmConfig;
    component: any;
  };
}

export type ISerializedLeaf = ISerializedCommon & {
  kind: "leaf";
  source: string;
};

export type ISerializedParent = ISerializedCommon & {
  kind: "parent";
  children: ISerializedNode[];
};
