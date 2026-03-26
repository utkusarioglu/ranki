import type { SanitizedNodeChildren, SanitizedNodeHidden, SanitizedNodeProps, SanitizedNodeStable } from "./sanitized-ast-node.types.mts";
export interface AstViewStore extends AstViewStoreState, AstViewStoreActions {
}
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
type VisibleBoolean<T> = {
    id: keyof T;
    visible: boolean;
};
export type VisibleBooleanCommon = {
    id: string;
    visible: boolean;
};
export interface SanitizedNodeView {
    hidden: SanitizedNodePropsView;
    props: SanitizedNodePropsView;
    children: SanitizedNodeChildrenView;
    stable: SanitizedNodeStableView;
}
export {};
//# sourceMappingURL=ast-view.store.types.d.mts.map