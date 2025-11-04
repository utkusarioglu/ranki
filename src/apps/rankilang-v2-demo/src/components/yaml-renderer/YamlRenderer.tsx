import type { FC } from "react";
import style from "./yaml-renderer.module.css";
import yaml from "yaml";
import "./prism-atom-dark.css";
import Prism from "prismjs";
import { crawl } from "../output/custom-tab-utils.mts";
import "prismjs/components/prism-yaml.js";
import type { AstNode } from "@ranki/package-api-v2";

interface YamlRendererProps {
  parsed: any | null; // !FIX any
  customPath: string;
  astNodeSelectedProps: string[];
  validationNodeSelectedProps: string[];
  transformNodeSelectedProps: string[];
}

function trimParams(param: any, properties: string[]) {
  const trimmed: Record<string, any> = {
    key: param.key,
    namespace: param.namespace,
    operator: param.operator,
  };
  let plugins;
  properties.forEach((p) => {
    const value = param[p];
    if (value) {
      switch (p) {
        case "plugins":
          plugins = trimPlugins(value, properties);
          break;
        default:
          trimmed[p] = value;
      }
    }
  });

  if (plugins) {
    trimmed["plugins"] = plugins;
  }

  return trimmed;
}

function trimPlugins(value: any, properties: string[]) {
  return {
    grammars: value.grammars,
    parser: {
      current: {
        type: value.parser.current.type,
        chain: value.parser.current.chain,
        ...(properties.includes("params") && {
          // @ts-ignore
          params: value.parser.current.params.map((p) =>
            trimParams(p, properties),
          ),
        }),
      },
    },
  };
}

function trimNode(astNode: AstNode, properties: string[]): any {
  const trimmed: Record<string, any> = {};
  if (!astNode.kind) {
    return astNode;
  }
  let children;
  let subtree;
  let plugins;
  properties.forEach((p) => {
    // @ts-expect-error
    const value = astNode[p];
    if (value) {
      if (astNode.kind === "parent") {
        switch (p) {
          case "children":
            children = astNode.children.map((c) => trimNode(c, properties));
            break;
          case "subtree":
            subtree = Object.fromEntries(
              Object.entries(
                // @ts-expect-error
                ([k, v]) => [k, trimNode(v, properties)],
              ),
            );
            break;
          case "plugins":
            plugins = trimPlugins(value, properties);
            break;
          default:
            trimmed[p] = value;
        }
      } else {
        switch (p) {
          case "plugins":
            plugins = trimPlugins(value, properties);
            break;
          default:
            trimmed[p] = value;
        }
      }
    }
  });

  if (plugins) {
    trimmed["plugins"] = plugins;
  }
  if (subtree) {
    trimmed["subtree"] = subtree;
  }
  if (children) {
    trimmed["children"] = children;
  }

  return trimmed;
}

export const YamlRenderer: FC<YamlRendererProps> = ({
  parsed,
  customPath,
  astNodeSelectedProps,
  validationNodeSelectedProps,
  transformNodeSelectedProps,
}) => {
  console.log("PARSED", { parsed });
  const trimmed = {
    report: parsed.report,
    theaters: Object.fromEntries(
      Object.keys(parsed.theaters).map((k) => [
        k,
        {
          raw: parsed.theaters[k].stages.raw,
          ast: {
            props: parsed.theaters[k].stages.ast.props,
            root: trimNode(
              parsed.theaters[k].stages.ast.root,
              astNodeSelectedProps,
            ),
          },
          validation: trimNode(
            parsed.theaters[k].stages.validation,
            validationNodeSelectedProps,
          ),
          transform: trimNode(
            parsed.theaters[k].stages.transform,
            transformNodeSelectedProps,
          ),
        },
      ]),
    ),
  };
  const crawled = crawl(trimmed, customPath);
  const yamlStr = yaml.stringify(crawled);
  const highlighted = Prism.highlight(
    yamlStr,
    Prism.languages.yaml,
    "javascript",
  );
  return (
    <pre className={style.outputPre}>
      <code
        className="language-yaml"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  );
};
