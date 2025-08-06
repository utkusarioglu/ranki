export type TransformNode = TransformNodeLeaf | TransformNodeParent;

export interface TransformNodeLeaf {
  kind: "leaf";
  tag: string;
  classNames: string;
  styles: string;
  text: string;
}

export interface TransformNodeParent {
  kind: "parent";
  tag: string;
  classNames: string;
  styles: string;
  children: TransformNode[];
}
