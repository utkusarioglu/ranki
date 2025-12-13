import { create } from "zustand";
import type { AstViewStore } from "./ast-view.store.types.mts";
import type {
  SanitizedNodeChildren,
  SanitizedNodeProps,
  SanitizedNodeStable,
} from "./sanitized-ast-node.mjs";

export const useAstViewStore = create<AstViewStore>((set) => ({
  props: wrapVisible<SanitizedNodeProps>(
    ["creator", "idList", "kind", "constructorName", "cpxUnique"],
    [
      "inlineDepth",
      "blockDepth",
      "childIndex",
      "chainList",
      "childCount",
      "creationMethod",
      "ignoredCount",
      "subtreeCount",
      "meaning",
    ],
  ),
  children: wrapVisible<SanitizedNodeChildren>(
    ["childrenNodes", "subtreeNodes"],
    ["tokenNodes", "spaceNodes"],
  ),
  stable: wrapVisible<SanitizedNodeStable>(["source"], []),

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
