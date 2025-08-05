export type TransformNode = TransformNodeLeaf | TransformNodeParent;

export interface TransformNodeLeaf {
  tag: string;
  classNames: string;
  styles: string;
  text: string;
}

export interface TransformNodeParent {
  tag: string;
  classNames: string;
  styles: string;
  children: TransformNode[];
}
