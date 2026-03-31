// MOVED
import type {
  AstNodeFilterKeys,
  AstNodeSanitizedTypesRecord,
} from "@dqm/package-dqm-v2-debug";

export interface AstViewStore extends AstViewStoreState, AstViewStoreActions {}

export interface AstViewStoreState {
  hidden: SanitizedNodePropsView;
  props: SanitizedNodePropsView;
  children: SanitizedNodePropsView;
  stable: SanitizedNodePropsView;
}

export interface AstViewStoreActions {
  setProps: (props: SanitizedNodePropsView) => void;
  setChildren: (c: SanitizedNodePropsView) => void;
  setStable: (c: SanitizedNodePropsView) => void;
}

type SanitizedNodePropsView = VisibleBoolean<AstNodeSanitizedTypesRecord>[];

type VisibleBoolean<T> = { id: keyof T; visible: boolean };

// !FIX I don't like this type
// the fact that each sanitized node prop group has their own type is useful in
// some places but this here makes things complicated.
export type VisibleBooleanCommon = { id: string; visible: boolean };

export interface SanitizedNodeView {
  hidden: SanitizedNodePropsView;
  props: SanitizedNodePropsView;
  children: SanitizedNodePropsView;
  stable: SanitizedNodePropsView;
}

export interface SanitizedNodeViewPreferences {
  hidden: AstNodeFilterKeys[];
  props: AstNodeFilterKeys[];
  children: AstNodeFilterKeys[];
  stable: AstNodeFilterKeys[];
}
