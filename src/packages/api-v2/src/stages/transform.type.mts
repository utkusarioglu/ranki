import type { ValidationNode, ValidationNodeLeaf } from "./validation.type.mjs";

export type TransformNode = TransformNodeParent | TransformNodeLeaf;

interface TransformNodeCommon {
  tag: string;
  creator: string;
  depth: number;
}

export type TransformNodeLeaf = TransformNodeCommon & {
  kind: "leaf";
  source: ValidationNodeLeaf["source"];
  print: boolean;
};

export type TransformNodeParent = TransformNodeCommon & {
  kind: "parent";
  children: TransformNode[];
};

export type RankiPluginParserTransformFunc = (
  v: ValidationNode,
) => TransformNode;

export type RankiPluginParserTransformDictionary = Record<
  string,
  RankiPluginParserTransformFunc
>;

export type RankiPluginParserTransformCallback =
  () => RankiPluginParserTransformDictionary;

export type TransformerFunctionEntry = {
  source: string;
  callback: RankiPluginParserTransformFunc;
};
