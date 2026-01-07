export type AstSourceString = string & { type?: "AstSourceString" };

export type CreatorName = string & { type?: "OhmJsCreatorName" };

export interface IAstNodeOhmCapabilities {
  getSourceString(): AstSourceString;
  getCreator(): CreatorName;
  getStartIndex(): number;
  getEndIndex(): number;
}
