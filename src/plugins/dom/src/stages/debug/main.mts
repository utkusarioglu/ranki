import type {
  AstNodeDefinite,
  PluginComponentStages,
  ValidationNode,
  TransformNode,
} from "@ranki/package-api";
import {
  astNodeLeaf,
  transformNodeLeaf,
  transformNodeParent,
  validationNodeLeaf,
  validationNodeParent,
} from "@ranki/package-api/helpers";
import { Html } from "@ranki/package-html";
import yaml from "yaml";

function validationRecurse(root: AstNodeDefinite) {
  switch (root.kind) {
    case "leaf":
      return validationNodeLeaf(root, {});
    case "parent":
      const children = root.children.map((n) => validationRecurse(n));
      const { kind, type, completion, parameters, configuration, attributes } =
        root;

      return validationNodeParent(
        {
          kind,
          type,
          completion,
          parameters,
          configuration,
          attributes,
        },
        {
          children,
        },
      );
  }
}

function transformRecurse(root: ValidationNode): TransformNode {
  switch (root.kind) {
    case "leaf":
      return transformNodeLeaf(root);
    case "parent":
      const children = root.children.map((c) => transformRecurse(c));
      return transformNodeParent(root, children);
  }
}

const plugin: PluginComponentStages = {
  parser: (n) =>
    astNodeLeaf({
      type: "pre",
      source: n.sourceString,
    }),
  validator: (v) => validationRecurse(v),
  transformer: (v) => transformRecurse(v),
  renderer: (p) => {
    const html = new Html();
    const element = html.single("pre", {
      format: "text",
      content: yaml.stringify(p),
    });
    return {
      selector: "made-up-selector",
      component: "made-up-component",
      element,
    };
  },
};

export default plugin;
