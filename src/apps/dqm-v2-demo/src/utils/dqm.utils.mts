import type { DqmParseOutput, IAstNode } from "@dqm/package-dqm-api-v2";
import type { SanitizationProp } from "../stores/dqm/dqm.store.types.mts";
import type {
  ParseRelevant,
  SanitizedNode,
  AstSanitizationFeature,
  SanitizedAst,
  ParseResult,
} from "./dqm.utils.types.mts";
import { Dqm } from "@dqm/package-dqm-v2";
import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import paramsV2 from "@dqm/plugin-params-v2";
import frameV2Code from "@dqm/plugin-frame-v2-code";

export const filterIds = (...all: SanitizationProp[][]) =>
  all
    .map((a) => a.filter(({ visible }) => visible).map((v) => v.id))
    .reduce((a, c) => [...a, ...c], [] as AstSanitizationFeature[]);

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
  const sanitized: SanitizedNode = {};

  features.forEach((feature) => {
    switch (feature) {
      case "meaning":
        try {
          sanitized[feature] = astNode.getMeaning();
        } catch {}
        break;
      case "constructorName":
        sanitized[feature] = astNode.constructor.name;
        break;
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
      case "chainList":
        sanitized[feature] = astNode
          .getCpx()
          .getChainList()
          .map((v) => v.join("."))
          .join(" | ");
        break;

      case "childrenNodes":
        const childrenNodes = astNode
          .getChildrenNodes()
          .map((n) => sanitizeAstSingle(n, features));
        if (childrenNodes.length) {
          sanitized[feature] = childrenNodes;
        }
        break;
      case "subtreeNodes":
        const subtreeNodes = astNode
          .getSubtreeNodes()
          .map((n) => sanitizeAstSingle(n, features));
        if (subtreeNodes.length) {
          sanitized[feature] = subtreeNodes;
        }
        break;
      case "tokenNodes":
        const tokenNodes = astNode
          .getTokenNodes()
          .map((n) => sanitizeAstSingle(n, features));
        if (tokenNodes.length) {
          sanitized[feature] = tokenNodes;
        }
        break;
      case "spaceNodes":
        const spaceNodes = astNode
          .getSpaceNodes()
          .map((n) => sanitizeAstSingle(n, features));
        if (spaceNodes.length) {
          sanitized[feature] = spaceNodes;
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

export function parseRaw({
  astDragProps,
  astNoDragProps,
  astLineageProps,
  // inputs,
  views,
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
    const parsed = dqm.parse(views);
    const sanitized = sanitizeAst(parsed, filteredIds);
    return {
      state: "success",
      data: {
        parsed,
        sanitized,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      state: "fail",
      error: e as any,
    };
  }
}
