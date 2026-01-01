import type {
  CommonTransportsConstructorParams,
  ICpx,
  ISerializedNode,
  ITrnCpsNode,
} from "../export.types.mjs";

export interface ITrnCpxNode {
  build(): ISerializedNode[];
  getOwnedTrnCpsTreeRoot(): ITrnCpsNode;
}

export type ITrnCpxNodeConstructor = new (
  cpx: ICpx,
  s: CommonTransportsConstructorParams,
) => ITrnCpxNode;
