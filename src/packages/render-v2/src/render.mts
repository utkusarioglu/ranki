import type { TransformNode } from "@ranki/package-api-v2";
import type {
  RankiPluginRenderer,
  RankiRenderNodeCssSpec,
  RankiRenderNodeOnLoadCallback,
} from "./types/plugin.type.mjs";
import { RenderLibrary } from "./library.mjs";
import type {
  RenderClientOptions,
  RenderFunctionReturn,
} from "./types/render.type.mjs";

export class Render {
  static library = new RenderLibrary();

  static addPlugin(plugin: RankiPluginRenderer) {
    Render.library.addPlugin(plugin);
  }

  static async render(
    tns: TransformNode[],
    options: RenderClientOptions,
  ): Promise<RenderFunctionReturn[]> {
    return Promise.all(tns.map((tn) => Render.renderNode(tn, options)));
  }

  private static async renderNode(
    tn: TransformNode,
    options: RenderClientOptions,
  ): Promise<RenderFunctionReturn> {
    const renderer = await Render.library.getRenderer(tn.tag);
    const rendered = await renderer(tn, options);
    const afterMount: RankiRenderNodeOnLoadCallback[] = [];
    const beforeUnmount: RankiRenderNodeOnLoadCallback[] = [];
    const cssMap = new Map<string, RankiRenderNodeCssSpec>();
    if (rendered.slots) {
      if (tn.kind === "parent") {
        const children = await Promise.all(
          tn.children.map((c) => this.renderNode(c, options)),
        );
        if (children && !rendered.slots.children) {
          throw new Error(
            "TRANSFORM NODE HAS CHILDREN BUT RENDER NODE OFFERS NO SLOT",
          );
        }
        rendered.slots.children.replaceWith(
          ...children.map(({ element }) => element),
        );
        children.forEach((c) => {
          c.afterMount && afterMount.push(...c.afterMount);
          c.beforeUnmount && beforeUnmount.push(...c.beforeUnmount);
          c.css?.forEach((s) => cssMap.set(s.id, s));
        });
      }
    }
    rendered.afterMount?.forEach((f) => afterMount.push(f));
    rendered.beforeUnmount?.forEach((f) => beforeUnmount.push(f));
    rendered.css?.forEach((s) => cssMap.set(s.id, s));
    return {
      element: rendered.element,
      slots: rendered.slots,
      // ...rendered,
      css: Array.from(cssMap.values()),
      afterMount,
      beforeUnmount,
    };
  }
}
