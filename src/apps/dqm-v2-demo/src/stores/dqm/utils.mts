import type {
  // CreateDefaultsReturn, ParseRelevant,
  // SanitizationProp,
  TemplateGroup,
  TemplateTextProcessed,
} from "./dqm.store.types.mts";
import type { AstSanitizationFeature } from "../../utils/dqm.utils.types.mts";
// import { parseRaw } from "../../utils/dqm.mts";

export type TemplateGroupWithList = TemplateGroup & {
  list: TemplateTextProcessed[];
};

// export function createDefaults(relevant: ParseRelevant): CreateDefaultsReturn {
//   const processed = parseRaw(relevant);
//   if (processed.state !== "success") {
//     throw processed.error;
//   }
//   return {
//     ...relevant,
//     ...processed.data,
//     // processed: processed.data,
//   };
// }

export const wrapVisible = (
  visible: AstSanitizationFeature[],
  hidden: AstSanitizationFeature[],
) => [
  ...visible.map((id) => ({ visible: true, id })),
  ...hidden.map((id) => ({ visible: false, id })),
];

// export type TemplateLists = TemplateGroupWithList[];

// export function buildTemplateLists(
//   groups: TemplateGroup[],
//   texts: TemplateText[],
// ): TemplateLists {
//   const gMap = new Map<string, TemplateGroupWithList>();
//   groups.forEach((g) =>
//     gMap.set(g.group, {
//       ...g,
//       list: [],
//     }),
//   );

//   texts.forEach((t) => {
//     const g = gMap.get(t.group);
//     if (!g) {
//       throw new Error(`Nonexistent group: ${t.group}`);
//     }
//     g.list.push(t);
//   });

//   for (const g of gMap) {
//     if (!gMap.get(g[0])!.list.length) {
//       gMap.delete(g[0]);
//     }
//   }

//   return Array.from(gMap.values());
// }
