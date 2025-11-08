import type { TransformNode } from "@ranki/package-api-v2";
import type {
  RankiPluginRenderer,
  RankiRenderNodeCssSpec,
  RankiRenderNodeOnLoadCallback,
} from "./types/plugin.type.mjs";
import { RenderLibrary } from "./library.mjs";
import type { RenderFunctionReturn } from "./types/render.type.mjs";

export class Render {
  static library = new RenderLibrary();

  static addPlugin(plugin: RankiPluginRenderer) {
    Render.library.addPlugin(plugin);
  }

  static async render(tn: TransformNode): Promise<RenderFunctionReturn> {
    const renderer = await Render.library.getRenderer(tn.tag);
    const rendered = await renderer(tn);
    const onLoad: RankiRenderNodeOnLoadCallback[] = [];
    const cssMap = new Map<string, RankiRenderNodeCssSpec>();
    if (rendered.slots) {
      if (tn.kind === "parent") {
        const children = await Promise.all(
          tn.children.map((c) => this.render(c)),
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
          c.onLoad && onLoad.push(...c.onLoad);
          c.css?.forEach((s) => cssMap.set(s.id, s));
        });
      }
    }
    rendered.onLoad?.forEach((f) => onLoad.push(f));
    rendered.css?.forEach((s) => cssMap.set(s.id, s));
    return {
      ...rendered,
      css: Array.from(cssMap.values()),
      onLoad,
    };
  }
}
