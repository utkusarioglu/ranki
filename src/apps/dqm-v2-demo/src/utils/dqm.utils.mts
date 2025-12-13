// import type { DqmParseOutput, IAstNode } from "@dqm/package-dqm-api-v2";
// import type {
//   SanitizedNodePartial,
//   SanitizedAst,
//   ParseResult,
//   SanitizedNodeProps,
//   SanitizedNodeChildren,
//   SanitizedNodeStable,
// } from "./dqm.utils.types.mts";
// import type {
//   AstViewStoreState,
//   SanitizedNodeView,
//   SanitizedNodeViewVisible,
// } from "../stores/ast-view/ast-view.store.types.mts";

// function filterIds(all: SanitizedNodeView): SanitizedNodeViewVisible {
//   // @ts-expect-error
//   return Object.fromEntries(
//     Object.entries(all).map(([k, v]) => {
//       // @ts-expect-error
//       const b = v.filter((l) => l.visible);

//       return [k, b];
//     }),
//   );
// }

// function sanitizeAst(
//   parsed: DqmParseOutput,
//   features: SanitizedNodeViewVisible,
// ): SanitizedAst[] {
//   return parsed.map((p) => ({
//     theater: p.theater,
//     sanitized: sanitizeAstSingle(p.ast, features),
//   }));
// }

// function sanitizeAstSingle(
//   astNode: IAstNode,
//   features: SanitizedNodeViewVisible,
// ): SanitizedNodePartial {
//   const props: Partial<SanitizedNodeProps> = {};
//   const children: Partial<SanitizedNodeChildren> = {};
//   const stable: Partial<SanitizedNodeStable> = {};

//   features.props.forEach(({ id }) => {
//     switch (id) {
//       case "inlineDepth":
//         props[id] = astNode.getInlineDepth();
//         break;
//       case "blockDepth":
//         props[id] = astNode.getBlockDepth();
//         break;
//       case "childIndex":
//         props[id] = astNode.getChildIndex();
//         break;
//       case "meaning":
//         try {
//           props[id] = astNode.getMeaning();
//         } catch {}
//         break;
//       case "constructorName":
//         props[id] = astNode.constructor.name;
//         break;
//       case "creationMethod":
//         props[id] = astNode.getCreationMethod();
//         break;
//       case "ignoredCount":
//         props[id] = astNode.getIgnoredNodes().length;
//         break;
//       case "kind":
//         props[id] = astNode.getKind();
//         break;
//       case "subtreeCount":
//         props[id] = astNode.getSubtreeNodes().length;
//         break;
//       case "childCount":
//         props[id] = astNode.getChildrenNodes().length;
//         break;
//       case "cpxUnique":
//         props[id] = astNode.getCpx().getId().getUnique();
//         break;
//       case "creator":
//         props[id] = astNode.getCreator();
//         break;
//       case "idList":
//         props[id] = astNode
//           .getCpx()
//           .getIdList()
//           .map((v) => v.join("."))
//           .join(" | ");
//         break;
//       case "chainList":
//         props[id] = astNode
//           .getCpx()
//           .getChainList()
//           .map((v) => v.join("."))
//           .join(" | ");
//         break;
//     }
//   });

//   features.children.forEach(({ id }) => {
//     switch (id) {
//       case "childrenNodes":
//         const childrenNodes = astNode
//           .getChildrenNodes()
//           .map((n) => sanitizeAstSingle(n, features));
//         if (childrenNodes.length) {
//           children[id] = childrenNodes;
//         }
//         break;
//       case "subtreeNodes":
//         const subtreeNodes = astNode
//           .getSubtreeNodes()
//           .map((n) => sanitizeAstSingle(n, features));
//         if (subtreeNodes.length) {
//           children[id] = subtreeNodes;
//         }
//         break;
//       case "tokenNodes":
//         const tokenNodes = astNode
//           .getTokenNodes()
//           .map((n) => sanitizeAstSingle(n, features));
//         if (tokenNodes.length) {
//           children[id] = tokenNodes;
//         }
//         break;
//       case "spaceNodes":
//         const spaceNodes = astNode
//           .getSpaceNodes()
//           .map((n) => sanitizeAstSingle(n, features));
//         if (spaceNodes.length) {
//           children[id] = spaceNodes;
//         }
//         break;
//     }
//   });

//   features.stable.forEach(({ id }) => {
//     switch (id) {
//       case "source":
//         stable[id] =
//           astNode.getKind() === "leaf"
//             ? astNode.getLeafView()
//             : {
//                 type: "string",
//                 raw: astNode.getSourceString(),
//               };
//         break;
//       default:
//         throw new Error(`Unrecognized sanitize feature: ${id}`);
//     }
//   });

//   const sanitized: SanitizedNodePartial = {
//     props,
//     children,
//     stable,
//   };
//   return sanitized;
// }

// export function createSanitized(
//   parsed: DqmParseOutput,
//   props: AstViewStoreState["props"],
//   children: AstViewStoreState["children"],
//   stable: AstViewStoreState["stable"],
// ): ParseResult {
//   try {
//     const filteredIds = filterIds({ props, children, stable });
//     const sanitized = sanitizeAst(parsed, filteredIds);
//     return {
//       state: "success",
//       data: {
//         parsed,
//         sanitized,
//       },
//     };
//   } catch (e) {
//     console.log(e);
//     return {
//       state: "fail",
//       error: e as any,
//     };
//   }
// }
