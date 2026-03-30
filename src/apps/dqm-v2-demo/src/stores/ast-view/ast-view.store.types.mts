// MOVED
import type {
  SanitizedNodeChildren,
  SanitizedNodeHidden,
  AstCalls,
  SanitizedNodeStable,
} from "@dqm/package-dqm-v2-debug";

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

type SanitizedNodePropsView = VisibleBoolean<AstCalls>[];
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

// MOVED
export interface SanitizedNodeViewPreferences {
  hidden: (keyof SanitizedNodeHidden)[];
  props: (keyof AstCalls)[];
  children: (keyof SanitizedNodeChildren)[];
  stable: (keyof SanitizedNodeStable)[];
}
