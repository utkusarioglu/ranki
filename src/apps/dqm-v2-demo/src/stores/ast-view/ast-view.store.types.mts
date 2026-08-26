import type { AstNodeSanitizedTypesRecord } from "@dqm/package-dqm-v2-debug";

export interface AstViewStore extends AstViewStoreActions, AstViewStoreState {}

export interface AstViewStoreActions {
  setChildren: (c: SanitizedNodePropsView) => void;
  setProps: (props: SanitizedNodePropsView) => void;
  setStable: (c: SanitizedNodePropsView) => void;
}

export interface AstViewStoreState {
  children: SanitizedNodePropsView;
  hidden: SanitizedNodePropsView;
  props: SanitizedNodePropsView;
  stable: SanitizedNodePropsView;
}

export interface SanitizedNodeView {
  children: SanitizedNodePropsView;
  hidden: SanitizedNodePropsView;
  props: SanitizedNodePropsView;
  stable: SanitizedNodePropsView;
}

// !FIX I don't like this type
// the fact that each sanitized node prop group has their own type is useful in
// some places but this here makes things complicated.
export type VisibleBooleanCommon = { id: string; visible: boolean };

type SanitizedNodePropsView = VisibleBoolean<AstNodeSanitizedTypesRecord>[];

type VisibleBoolean<T> = { id: keyof T; visible: boolean };

// export interface SanitizedNodeViewPreferences {
//   hidden: AstNodeFilterKeys[];
//   props: AstNodeFilterKeys[];
//   children: AstNodeFilterKeys[];
//   stable: AstNodeFilterKeys[];
// }
