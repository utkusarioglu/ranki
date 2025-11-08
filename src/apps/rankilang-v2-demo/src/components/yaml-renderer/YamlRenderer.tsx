import { useState, type FC } from "react";
import style from "./yaml-renderer.module.css";
import yaml from "yaml";
import "./prism-atom-dark.css";
import Prism from "prismjs";
import { crawl } from "../output/custom-tab-utils.mts";
import "prismjs/components/prism-yaml.js";
import type { AstNode, TransformNode } from "@ranki/package-api-v2";

interface YamlRendererProps {
  parsed: any | null; // !FIX any
  customPath: string;
  astNodeSelectedProps: string[];
  validationNodeSelectedProps: string[];
  transformNodeSelectedProps: string[];
}

function trimParams(param: any, properties: string[]) {
  const trimmed: Record<string, any> = {
    creator: param.creator,
    namespace: param.namespace,
    type: param.type,
    key: param.key,
    operator: param.operator,
    shape: param.shape,
    source: param.source,
    values: param.values,
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
function trimParamList(list: any, properties: string[]) {
  // @ts-expect-error
  return list.map((p) => trimParams(p, properties));
}

function trimPlugins(value: any, properties: string[]) {
  return {
    grammars: value.grammars,
    parser: {
      current: {
        type: value.parser.current.type,
        chain: value.parser.current.chain,
        params: trimParamList(value.parser.current.params, properties),
      },
    },
    transformer: {
      handler: value.transformer.handler,
      chain: value.transformer.chain,
      params: trimParamList(value.transformer.params, properties),
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

function trimTransformNode(
  nodes: TransformNode[],
  properties: string[],
): TransformNode[] {
  return nodes.map((node) => {
    switch (node.kind) {
      case "parent":
        return {
          ...node,
          params: trimParamList(node.params, properties),
          children: trimTransformNode(node.children, properties),
          // children: node.children.map((c) => trimTransformNode(c, properties)),
        };
      case "leaf":
        return {
          ...node,
          params: trimParamList(node.params, properties),
        };
    }
  });
}

export const YamlChild: FC<{ rawNode: Record<string, any>[] }> = ({
  rawNode,
}) => {
  if (Array.isArray(rawNode)) {
    return rawNode.map((n, i) => (
      <>
        <span className={["monospace", style.leftPadded].join(" ")}>{i}:</span>
        <YamlChildObject rawNode={n} key={i} />
      </>
    ));
  } else {
    return <YamlChildObject rawNode={rawNode} />;
  }
};

export const YamlChildObject: FC<{ rawNode: Record<string, any> }> = ({
  rawNode,
}) => {
  const [childrenDim, setChildrenDim] = useState(false);
  const [childrenHide, setChildrenHide] = useState(false);

  let children: any[] = [];
  const node = { ...rawNode };
  if (rawNode.children) {
    children = [...rawNode.children];
  }
  delete node.children;
  const yamlStr = yaml.stringify(node);
  const highlighted = Prism.highlight(
    yamlStr,
    Prism.languages.yaml,
    "javascript",
  );
  return (
    <>
      <pre className={style.outputPre}>
        <code
          className="language-yaml"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
      {children.length && childrenHide ? (
        <div
          className={style.hidden}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setChildrenHide(false);
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          hidden
        </div>
      ) : null}
      {children.length && !childrenHide ? (
        <div
          className={style.outputMargin}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setChildrenHide(true);
            setChildrenDim(false);
          }}
          onClick={(e) => {
            e.stopPropagation();
            setChildrenDim((s) => !s);
          }}
          style={{
            opacity: childrenDim ? 0.5 : 1,
          }}
        >
          <span className={["monospace", style.leftPadded].join(" ")}>
            children:
          </span>
          {children.map((child, i) => (
            <YamlChild key={i} rawNode={child} />
          ))}
        </div>
      ) : null}
    </>
  );
};

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
          transform: trimTransformNode(
            parsed.theaters[k].stages.transform,
            transformNodeSelectedProps,
          ),
        },
      ]),
    ),
  };
  const crawled = crawl(trimmed, customPath);
  // const yamlStr = yaml.stringify(crawled);
  // const highlighted = Prism.highlight(
  //   yamlStr,
  //   Prism.languages.yaml,
  //   "javascript",
  // );
  return (
    <>
      <h1 className={["monospace", style.leftPadded].join(" ")}>Ast</h1>
      <YamlChild rawNode={crawled.theaters.default.ast.root} />
      <h1 className="monospace">Validation</h1>
      <YamlChild rawNode={crawled.theaters.default.validation} />
      <h1 className="monospace">Transform</h1>
      <YamlChild rawNode={crawled.theaters.default.transform} />
    </>
    // <pre className={style.outputPre}>
    //   <code
    //     className="language-yaml"
    //     dangerouslySetInnerHTML={{ __html: highlighted }}
    //   />
    // </pre>
  );
};
