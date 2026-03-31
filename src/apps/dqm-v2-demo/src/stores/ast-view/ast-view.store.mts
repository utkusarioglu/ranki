import { create } from "zustand";
import type {
  AstViewStore,
  SanitizedNodeView,
  SanitizedNodeViewPreferences,
} from "./ast-view.store.types.mts";
import type { SanitizedNodeProps } from "@dqm/package-dqm-v2-debug";

export const useAstViewStore = create<AstViewStore>((set) => ({
  props: wrapVisible<SanitizedNodeProps>(
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
  hidden: wrapVisible<SanitizedNodeProps>(["cpxUnique"], []),
  children: wrapVisible<SanitizedNodeProps>(
    ["childrenNodes", "subtreeNodes"],
    ["tokenNodes", "spaceNodes"],
  ),
  stable: wrapVisible<SanitizedNodeProps>(["sourceString"], []),

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
