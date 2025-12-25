export type IAstNodeRelationship = "space" | "token" | "node";

export type CreationMethod = string & { type?: "CreationMethod" };

export type IAstNodeKind = "parent" | "leaf";

export type ContentDirection = "block" | "inline";

export type IAstNodeNature = "literal" | "synthetic";

export interface IAstNodeSemanticCapabilities {
  getKind(): IAstNodeKind;

  /**
   * Associates a token with its intended meaning. Such as `assignment` for `=`
   * in params.
   */
  setMeaning(meaning: string): this;
  getMeaning(): string;

  /**
   * Defines the method in the action dictionary that was called to create this node
   */
  setCreationMethod(method: CreationMethod): this;
  getCreationMethod(): CreationMethod;
  setDirection(direction: ContentDirection): this;
  getDirection(): ContentDirection;

  setRelationship(relationship: IAstNodeRelationship): this;

  /**
   * literal for nodes created by what's in the course dqm, synthetic
   * for nodes created through processes such as wrapping words with
   * bold because of *<word>*
   */
  setNature(nature: IAstNodeNature): this;
  getNature(): IAstNodeNature;
  getRelationship(): IAstNodeRelationship;
}
