import type { ValidationNode } from "./validation.mjs";

export type TransformNode = TransformNodeParent | TransformNodeLeaf;

interface TransformNodeCommon {
  tag: string;
}

export type TransformNodeLeaf = TransformNodeCommon & {
  kind: "leaf";
  value: string;
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
