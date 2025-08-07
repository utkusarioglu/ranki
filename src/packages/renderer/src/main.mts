import type {
  ApiStageTransformed,
  ApiStageRendered,
  RenderNodeParent,
  RenderNodeLeaf,
  TransformNode,
  PluginComponentRenderer,
  TransformNodeLeaf,
  TransformNodeParent,
  RankiContext,
} from "@ranki/package-api";
import { Html } from "@ranki/package-html";

// function rootRenderer(root: TransformNode): Promise<PluginComponentRenderer> {
//   switch (root.kind) {
//     case "leaf":
//       return Promise.resolve((t: TransformNodeLeaf) => ({
//         selector: `selector-${t.tag}`,
//         component: "aa",
//         element: Html.single(t.tag, {
//           format: "text",
//           content: t.text,
//           style: "paddingLeft: 1em",
//         }),
//       }));
//     case "parent":
//       return Promise.resolve((t: TransformNodeParent) => {
//         const element = Html.single(t.tag, {
//           format: "html",
//           style: "padding-left: 1em",
//           children: [],
//         });
//         return {
//           selector: `selector-${t.tag}`,
//           component: "aa",
//           element,
//           inserts: {
//             children: element,
//           },
//         };
//       });
//   }
// }

// async function getRenderer(
//   root: TransformNode,
//   context: RankiContext,
// ): Promise<PluginComponentRenderer> {
//   switch (root.tag) {
//     case "document":
//     case "directive":
//     case "paragraph":
//     case "HEADING":
//     case "line":
//     case "word":
//       return rootRenderer(root);
//     default:
//       return context.plugins.getRenderer(root.tag);
//   }
// }

async function recursiveRenderer(
  root: TransformNode,
  context: RankiContext,
): Promise<RenderNodeParent | RenderNodeLeaf> {
  // const renderer = await getRenderer(root, context);
  const renderer = await context.plugins.getRenderer(root.tag);

  switch (root.kind) {
    case "leaf":
      return renderer(root);
    case "parent":
      const children = await Promise.all(
        root.children.map((c) => recursiveRenderer(c, context)),
      );
      const parent = renderer(root) as RenderNodeParent;
      children.forEach((child) => {
        parent.inserts.children.appendChild(child.element);
      });
      return parent;
  }
}

export async function render(
  transformed: ApiStageTransformed,
  context: RankiContext,
): Promise<ApiStageRendered> {
  return Promise.resolve({
    ...transformed,
    stage: "rendered",
    rendered: await recursiveRenderer(transformed.transformed, context),
  });
}
