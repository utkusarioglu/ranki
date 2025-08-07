import type {
  AstNodeDefinite,
  PluginComponentStages,
  ValidationNode,
  TransformNode,
  RenderNodeLeaf,
  RenderNodeParent,
} from "@ranki/package-api";
import {
  astNodeLeaf,
  transformNodeLeaf,
  transformNodeParent,
  validationNodeLeaf,
  validationNodeParent,
} from "@ranki/package-api/helpers";
import { Html } from "@ranki/package-html";

function validator(root: AstNodeDefinite): ValidationNode {
  const errorsAndWarnings: Pick<ValidationNode, "errors" | "warnings"> = {
    errors: [`ROOT DEBUG: ${root.type}`],
    warnings: [`ROOT DEBUG: ${root.type}`],
  };
  switch (root.kind) {
    case "leaf":
      return validationNodeLeaf(root, errorsAndWarnings);
    case "parent":
      return validationNodeParent(root, errorsAndWarnings, []);
  }
}

function transformer(root: ValidationNode): TransformNode {
  switch (root.kind) {
    case "leaf":
      const transformed = transformNodeLeaf(root);
      // transformed.classNames += " ROOT DIRECTIVE";
      return transformed;
    case "parent":
      return transformNodeParent(root, []);
  }
}

function renderer(t: TransformNode): RenderNodeLeaf | RenderNodeParent {
  switch (t.kind) {
    case "leaf":
      const leafElem = Html.single(t.tag, {
        format: "text",
        content: t.text,
      });
      return {
        selector: "made-up-selector-01",
        component: "made-up-component",
        element: leafElem,
      };
    case "parent":
      const parentElem = Html.single(t.tag, {
        format: "html",
        children: [],
        // content: JSON.stringify(t),
      });
      return {
        selector: "made-up-selector-01",
        component: "made-up-component",
        element: parentElem,
        inserts: {
          children: parentElem,
        },
      };
  }
}

const plugin: PluginComponentStages = {
  parser: (n) =>
    astNodeLeaf({
      type: "pre",
      source: n.sourceString,
    }),
  validator,
  transformer,
  renderer,
};

export default plugin;
