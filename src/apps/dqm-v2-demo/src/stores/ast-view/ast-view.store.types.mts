import type {
  SanitizedNodeChildren,
  SanitizedNodeProps,
  SanitizedNodeStable,
} from "./utils/sanitized-ast-node.types.mts";

export interface AstViewStore extends AstViewStoreState, AstViewStoreActions {}

export interface AstViewStoreState {
  props: SanitizedNodePropsView;
  children: SanitizedNodeChildrenView;
  stable: SanitizedNodeStableView;
}

export interface AstViewStoreActions {
  setProps: (props: SanitizedNodePropsView) => void;
  setChildren: (c: SanitizedNodeChildrenView) => void;
  setStable: (c: SanitizedNodeStableView) => void;
}

type SanitizedNodePropsView = VisibleBoolean<SanitizedNodeProps>[];
type SanitizedNodeChildrenView = VisibleBoolean<SanitizedNodeChildren>[];
type SanitizedNodeStableView = VisibleBoolean<SanitizedNodeStable>[];

type VisibleBoolean<T> = { id: keyof T; visible: boolean };

export interface SanitizedNodeView {
  props: SanitizedNodePropsView;
  children: SanitizedNodeChildrenView;
  stable: SanitizedNodeStableView;
}
