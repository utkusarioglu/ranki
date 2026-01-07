import type * as ohm from "ohm-js";
import type { IAstNodeRelationship } from "./node-semantic.cap.types.mjs";
import type { CreatorName } from "./ohm.cap.types.mjs";

export type ChildrenNodes<T> = T[] & { type?: "ChildrenNodes" };

export type TokenNodes<T> = T[] & { type?: "TokenNodes" };

export type SpaceNodes<T> = T[] & { type?: "SpaceNodes" };

export type SubtreeNodes<T> = T[] & { type?: "SubtreeNodes" };

export type PushedNodeDefinition = [IAstNodeRelationship, ohm.Node];

export interface IAstNodeSyntaxCapabilities<T> {
  getChildrenNodes(): ChildrenNodes<T>;
  getTokenNodes(): TokenNodes<T>;
  getSpaceNodes(): SpaceNodes<T>;
  getSubtreeNodes(): SubtreeNodes<T>;
  findSubtreeNodeByCreator(creator: CreatorName): T | undefined;
  findTokenNodeByCreator(creator: CreatorName): T | undefined;
  findSpaceNodeByCreator(creator: CreatorName): T | undefined;
  getIgnoredNodes(): ohm.Node[];
  pushNodes(...nodes: PushedNodeDefinition[]): this;
  pushIgnoredNodes(...nodes: ohm.Node[]): this;
}
