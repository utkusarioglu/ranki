import { create } from "zustand";
import type {
  AstViewStore,
  SanitizedNodeView,
  SanitizedNodeViewPreferences,
} from "./ast-view.store.types.mts";
import type {
  SanitizedNodeChildren,
  SanitizedNodeHidden,
  AstCalls,
  SanitizedNodeStable,
} from "@dqm/package-dqm-v2-debug";

export const useAstViewStore = create<AstViewStore>((set) => ({
  props: wrapVisible<AstCalls>(
    ["creator", "idListString", "kind", "constructorName", "astUnique"],
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

export function filterIds(
  all: SanitizedNodeView,
): SanitizedNodeViewPreferences {
  // @ts-expect-error
  return Object.fromEntries(
    Object.entries(all).map(([k, v]) => {
      // @ts-expect-error
      const b = v.filter((l) => l.visible).map((v) => v.id);

      return [k, b];
    }),
  );
}
