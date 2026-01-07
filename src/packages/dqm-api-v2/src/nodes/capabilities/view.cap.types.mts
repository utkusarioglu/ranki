/**
 * @dev
 * #1 This property's type can be anything depending on what decoder is defined
 * for the node.
 */
export interface AstSourceViewCommon {
  type: string;
  raw: string;
}

export type AstSourceView<Custom = any> = AstSourceViewCommon &
  AstSourceViewAdditional<Custom>;

export type AstSourceViewAdditional<Value = any> = {
  subType?: string;
  value: Value;
};

export type AstSourceViewDecoderCustom<Value> = (
  input: string,
) => AstSourceViewAdditional<Value>;

export interface IAstNodeViewCapabilities {
  getLeafView<T = any>(): AstSourceView<T>;
  setLeafViewDecoder(
    typeName: string,
    decoder: AstSourceViewDecoderCustom<any>,
  ): this;
}
