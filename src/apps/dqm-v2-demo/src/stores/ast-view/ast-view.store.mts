import { create } from "zustand";
import type { AstViewStore } from "./ast-view.store.types.mts";
import type {
  SanitizedNodeChildren,
  SanitizedNodeHidden,
  SanitizedNodeProps,
  SanitizedNodeStable,
} from "./utils/sanitized-ast-node.types.mts";

export const useAstViewStore = create<AstViewStore>((set) => ({
  props: wrapVisible<SanitizedNodeProps>(
    ["creator", "idListString", "kind", "constructorName"],
    [
      "cpxUnique",
      "inlineDepth",
      "blockDepth",
      "childIndex",
      "chainListString",
      "childCount",
      "creationMethod",
      "ignoredCount",
      "subtreeCount",
      "meaning",
    ],
  ),
  hidden: wrapVisible<SanitizedNodeHidden>(["cpxUnique"], []),
  children: wrapVisible<SanitizedNodeChildren>(
    ["childrenNodes", "subtreeNodes"],
    ["tokenNodes", "spaceNodes"],
  ),
  stable: wrapVisible<SanitizedNodeStable>(["sourceString"], []),

  sanitized: null,
  parsed: {
    state: "success",
    data: [],
  },

  setProps: (props) => set(() => ({ props })),
  setChildren: (children) => set(() => ({ children })),
  setStable: (stable) => set(() => ({ stable })),
}));

export function wrapVisible<T>(visible: (keyof T)[], hidden: (keyof T)[]) {
  return [
    ...visible.map((id) => ({ visible: true, id })),
    ...hidden.map((id) => ({ visible: false, id })),
  ];
}
