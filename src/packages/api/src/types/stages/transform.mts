export type TransformNode = TransformNodeLeaf | TransformNodeParent;

export type TransformNodeLeaf = TransformNodeAdds & {
  kind: "leaf";
  type: string; // TODO
  text: string;
};

export type TransformNodeParent = TransformNodeAdds & {
  kind: "parent";
  type: string; // TODO
  children: TransformNode[];
};

export interface TransformNodeAdds {
  tag: string;
  classNames: string;
  styles: string;
}
