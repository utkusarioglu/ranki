import type { Chain } from "../../export.types.mjs";

export interface SerializedPackage {
  serialized: ISerializedNode[];
  mount?: (c: ISerializedNode[]) => void | undefined;
}

export type ISerializedNode = ISerializedParent | ISerializedLeaf;

export type ISerializedKey = string & { type: "SerializedKey" };

interface ISerializedCommon {
  key: ISerializedKey;
  chain: Chain;
  props: Partial<Record<SerializationPropertiesUnion, any>>;
}

export type ISerializedLeaf = ISerializedCommon & {
  kind: "leaf";
  source: string;
};

export type ISerializedParent = ISerializedCommon & {
  kind: "parent";
  children: ISerializedNode[];
};

export type AstTypes = "astRootCreator";
export type CpsTypes = "chain";
export type AppTypes = "dqm";
export type ComponentTypes = "component";

export type SerializationPropertiesUnion =
  | AstTypes
  | CpsTypes
  | AppTypes
  | ComponentTypes;

// export type SerializationProperties = Set<SerializationPropertiesUnion>;

export type SerializeMethodParams = {
  props: SerializationPropertiesUnion[];
};
