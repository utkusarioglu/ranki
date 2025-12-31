import type { Chain, DqmConfig } from "../../export.types.mjs";

export type ISerializedNode = ISerializedParent | ISerializedLeaf;

interface ISerializedCommon {
  chain: Chain;
  // direction: ContentDirection;
  // creator: string;
  // depth: number;
  // hoist: number;
  dqm: DqmConfig;
  component: any;
}

export type ISerializedLeaf = ISerializedCommon & {
  kind: "leaf";
  source: string;
};

export type ISerializedParent = ISerializedCommon & {
  kind: "parent";
  children: ISerializedNode[];
};
