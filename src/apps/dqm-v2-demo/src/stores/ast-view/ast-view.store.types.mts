import type {
  SanitizeResult,
  SanitizedNodeChildren,
  SanitizedNodeProps,
  SanitizedNodeStable,
} from "./sanitized-ast-node.mjs";
import type { ParseResult } from "../dqm/dqm.store.types.mts";

export interface AstViewStore extends AstViewStoreState, AstViewStoreActions {}

export interface AstViewStoreState {
  props: SanitizedNodePropsView;
  children: SanitizedNodeChildrenView;
  stable: SanitizedNodeStableView;

  // !FIX this is duplicated with dqm store
  // parsed: ParseResult;

  // sanitized: SanitizeResult | null;
}

export interface AstViewStoreActions {
  // setParsed: (views: ParseResult) => void;

  setProps: (props: SanitizedNodePropsView) => void;
  setChildren: (c: SanitizedNodeChildrenView) => void;
  setStable: (c: SanitizedNodeStableView) => void;
}

type SanitizedNodePropsView = VisibleBoolean<SanitizedNodeProps>[];
// type SanitizedNodePropsViewVisible = VisibleTrue<SanitizedNodeProps>[];
type SanitizedNodeChildrenView = VisibleBoolean<SanitizedNodeChildren>[];
// type SanitizedNodeChildrenViewVisible = VisibleTrue<SanitizedNodeChildren>[];
type SanitizedNodeStableView = VisibleBoolean<SanitizedNodeStable>[];
// type SanitizedNodeStableViewVisible = VisibleTrue<SanitizedNodeStable>[];

type VisibleBoolean<T> = { id: keyof T; visible: boolean };
// type VisibleTrue<T> = { id: keyof T; visible: boolean };

// export interface SanitizedNodeViewVisible {
//   props: SanitizedNodePropsViewVisible;
//   children: SanitizedNodeChildrenViewVisible;
//   stable: SanitizedNodeStableViewVisible;
// }

export interface SanitizedNodeView {
  props: SanitizedNodePropsView;
  children: SanitizedNodeChildrenView;
  stable: SanitizedNodeStableView;
}
