import type {
  AstSourceString,
  CommonTransportsConstructorParams,
  IAstNodeKind,
  ICps,
  ISerializedNode,
  IVerticesCapability,
} from "../export.types.mjs";

export interface ITrnCpsNode extends IVerticesCapability<ITrnCpsNode> {
  readonly cps: ICps;

  getKind(): IAstNodeKind;
  setSource(s: AstSourceString): this;
  build(): ISerializedNode[];

  newTrnCpsNode(): ITrnCpsNode;
}

export type ITrnCpsNodeConstructor = new (
  cps: ICps,
  s: CommonTransportsConstructorParams,
) => ITrnCpsNode;
