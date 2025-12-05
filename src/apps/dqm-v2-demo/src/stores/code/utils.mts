import type {
  DqmParseOutput,
  DqmParseTheater,
  IAstNode,
} from "@dqm/package-dqm-api-v2";
import type {
  CreateDefaultsReturn,
  ParseRelevant,
  SanitizedNode,
  SanitizationFeature,
  ParseResult,
  Prop,
} from "./types.mts";
import { Dqm } from "@dqm/package-dqm-v2";
import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import paramsV2 from "@dqm/plugin-params-v2";
import frameV2Code from "@dqm/plugin-frame-v2-code";

export function sanitizeAll(
  parsed: DqmParseOutput,
  features: SanitizationFeature[],
): Record<DqmParseTheater, SanitizedNode> {
  return Object.fromEntries(
    Object.entries(parsed).map(([theater, dqm]) => [
      theater,
      sanitizeSingle(dqm, features),
    ]),
  );
}

function sanitizeSingle(astNode: IAstNode, features: string[]): SanitizedNode {
  const children = astNode
    .getChildrenNodes()
    .map((n) => sanitizeSingle(n, features));
  const subtree = astNode
    .getSubtreeNodes()
    .map((n) => sanitizeSingle(n, features));
  const sanitized: SanitizedNode = {};

  features.forEach((feature) => {
    switch (feature) {
      case "creator":
        sanitized["creator"] = astNode.getCreator();
        break;
      case "idList":
        sanitized["idList"] = astNode
          .getCpx()
          .getIdList()
          .map((v) => v.join("."))
          .join(" | ");
        break;
      case "children":
        if (children.length) {
          sanitized["children"] = children;
        }
        break;
      case "subtree":
        if (subtree.length) {
          sanitized["subtree"] = subtree;
        }
        break;
      case "source":
        sanitized["source"] =
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

export const filterIds = (...all: Prop[][]) =>
  all
    .map((a) => a.filter(({ visible }) => visible).map((v) => v.id))
    .reduce((a, c) => [...a, ...c], [] as SanitizationFeature[]);

export function parseRaw({
  dragProps,
  noDragProps,
  lineageProps,
  inputs,
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
    const filteredIds = filterIds(dragProps, lineageProps, noDragProps);
    const parsed = dqm.parse(inputs);
    const sanitized = sanitizeAll(parsed, filteredIds);
    return {
      state: "success",
      data: {
        ...inputs,
        parsed,
        sanitized,
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
    processed: processed.data,
  };
}

export const wrapVisible = (all: SanitizationFeature[]) =>
  all.map((id) => ({ visible: true, id }));
