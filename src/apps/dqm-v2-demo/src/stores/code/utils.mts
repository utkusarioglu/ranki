import type { DqmParseOutput, IAstNode } from "@dqm/package-dqm-api-v2";
import type {
  CreateDefaultsReturn,
  ParseRelevant,
  SanitizedNode,
  AstSanitizationFeature,
  ParseResult,
  SanitizationProp,
  SanitizedAst,
  TemplateGroup,
  TemplateTextProcessed,
} from "./code.store.types.mts";
import { Dqm } from "@dqm/package-dqm-v2";
import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import paramsV2 from "@dqm/plugin-params-v2";
import frameV2Code from "@dqm/plugin-frame-v2-code";

export function sanitizeAst(
  parsed: DqmParseOutput,
  features: AstSanitizationFeature[],
): SanitizedAst[] {
  return parsed.map((p) => ({
    theater: p.theater,
    sanitized: sanitizeAstSingle(p.ast, features),
  }));
}

function sanitizeAstSingle(
  astNode: IAstNode,
  features: string[],
): SanitizedNode {
  const children = astNode
    .getChildrenNodes()
    .map((n) => sanitizeAstSingle(n, features));
  const subtree = astNode
    .getSubtreeNodes()
    .map((n) => sanitizeAstSingle(n, features));
  const sanitized: SanitizedNode = {};

  features.forEach((feature) => {
    switch (feature) {
      case "creationMethod":
        sanitized[feature] = astNode.getCreationMethod();
        break;
      case "ignoredCount":
        sanitized[feature] = astNode.getIgnoredNodes().length;
        break;
      case "kind":
        sanitized[feature] = astNode.getKind();
        break;
      case "subtreeCount":
        sanitized[feature] = astNode.getSubtreeNodes().length;
        break;
      case "childCount":
        sanitized[feature] = astNode.getChildrenNodes().length;
        break;
      case "cpxUnique":
        sanitized[feature] = astNode.getCpx().getId().getUnique();
        break;
      case "creator":
        sanitized[feature] = astNode.getCreator();
        break;
      case "idList":
        sanitized[feature] = astNode
          .getCpx()
          .getIdList()
          .map((v) => v.join("."))
          .join(" | ");
        break;
      case "children":
        if (children.length) {
          sanitized[feature] = children;
        }
        break;
      case "subtree":
        if (subtree.length) {
          sanitized[feature] = subtree;
        }
        break;
      case "source":
        sanitized[feature] =
          astNode.getKind() === "leaf"
            ? astNode.getLeafView()
            : {
                type: "string",
                raw: astNode.getSourceString(),
              };
        break;
      default:
        throw new Error(`Unrecognized sanitize feature: ${feature}`);
    }
  });

  return sanitized;
}

export const filterIds = (...all: SanitizationProp[][]) =>
  all
    .map((a) => a.filter(({ visible }) => visible).map((v) => v.id))
    .reduce((a, c) => [...a, ...c], [] as AstSanitizationFeature[]);

export function parseRaw({
  astDragProps,
  astNoDragProps,
  astLineageProps,
  inputs,
  views: viewed,
}: ParseRelevant): ParseResult {
  const dqm = new Dqm(
    {
      // @ts-ignore it expects the entire object
      console: {
        // @ts-ignore it expects the entire object
        plugins: {
          requested: ["ParamsV2", "FrameV2"],
        },
      },
    },
    [baseV2, frameV2, paramsV2, frameV2Code],
  );
  try {
    const filteredIds = filterIds(
      astDragProps,
      astLineageProps,
      astNoDragProps,
    );
    const parsed = dqm.parse(inputs);
    const sanitizedAst = sanitizeAst(parsed, filteredIds);
    return {
      state: "success",
      data: {
        inputs,
        views: viewed,
        parsed,
        sanitizedAst,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      state: "fail",
      error: (e as unknown as Error).toString(),
    };
  }
}

export function createDefaults(relevant: ParseRelevant): CreateDefaultsReturn {
  const processed = parseRaw(relevant);
  if (processed.state !== "success") {
    throw new Error("Fault in default values", { cause: processed.error });
  }
  return {
    ...relevant,
    ...processed.data,
    // processed: processed.data,
  };
}

export const wrapVisible = (
  visible: AstSanitizationFeature[],
  hidden: AstSanitizationFeature[],
) => [
  ...visible.map((id) => ({ visible: true, id })),
  ...hidden.map((id) => ({ visible: false, id })),
];

export type TemplateGroupWithList = TemplateGroup & {
  list: TemplateTextProcessed[];
};

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
