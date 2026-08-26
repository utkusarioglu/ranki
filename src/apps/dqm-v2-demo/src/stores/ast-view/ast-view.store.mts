import type {
  AstNodeFiltersRecord,
  AstNodeSanitizedTypesRecord,
} from "@dqm/package-dqm-v2-debug";

import { create } from "zustand";

import type {
  AstViewStore,
  SanitizedNodeView,
} from "./ast-view.store.types.mts";

export const useAstViewStore = create<AstViewStore>((set) => ({
  children: wrapVisible<AstNodeSanitizedTypesRecord>(
    ["childrenNodes", "subtreeNodes"],
    ["tokenNodes", "spaceNodes"],
  ),
  hidden: wrapVisible<AstNodeSanitizedTypesRecord>(["cpxUnique"], []),
  parsed: {
    data: [],
    state: "success",
  },
  props: wrapVisible<AstNodeSanitizedTypesRecord>(
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

  sanitized: null,
  setChildren: (children) => set(() => ({ children })),

  setProps: (props) => set(() => ({ props })),
  setStable: (stable) => set(() => ({ stable })),
  stable: wrapVisible<AstNodeSanitizedTypesRecord>(["sourceString"], []),
}));

export function filterIds(all: SanitizedNodeView): AstNodeFiltersRecord {
  return Object.fromEntries(
    Object.entries(all).map(([k, v]) => {
      // @ts-expect-error
      const b = v.filter((l) => l.visible).map((v) => v.id);

      return [k, b];
    }),
  ) as AstNodeFiltersRecord;
}

function wrapVisible<T>(visible: (keyof T)[], hidden: (keyof T)[]) {
  return [
    ...visible.map((id) => ({ id, visible: true })),
    ...hidden.map((id) => ({ id, visible: false })),
  ];
}
