import type {
  SanitizedNodeChildren,
  SanitizedNodeHidden,
  SanitizedNodeProps,
  SanitizedNodeStable,
} from "./sanitized-ast-node.types.mts";

export interface AstViewStore extends AstViewStoreState, AstViewStoreActions {}

export interface AstViewStoreState {
  hidden: SanitizedNodeHiddenView;
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
type SanitizedNodeHiddenView = VisibleBoolean<SanitizedNodeHidden>[];
type SanitizedNodeChildrenView = VisibleBoolean<SanitizedNodeChildren>[];
type SanitizedNodeStableView = VisibleBoolean<SanitizedNodeStable>[];

type VisibleBoolean<T> = { id: keyof T; visible: boolean };

// !FIX I don't like this type
// the fact that each sanitized node prop group has their own type is useful in
// some places but this here makes things complicated.
export type VisibleBooleanCommon = { id: string; visible: boolean };

export interface SanitizedNodeView {
  hidden: SanitizedNodePropsView;
  props: SanitizedNodePropsView;
  children: SanitizedNodeChildrenView;
  stable: SanitizedNodeStableView;
}
