import type { TransformNode } from "@ranki/package-api-v2";
import type {
  RankiPluginRenderer,
  RankiRenderPluginItemRenderFunctionReturnCssSpec,
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
    const rendered = renderer(tn);
    const cssMap = new Map<
      string,
      RankiRenderPluginItemRenderFunctionReturnCssSpec
    >();
    if (rendered.slots) {
      if (tn.kind === "parent") {
        const children = await Promise.all(
          tn.children.map((c) => this.render(c)),
        );
        children.forEach((c) => {
          rendered.slots?.children.appendChild(c.element);
          c.css?.forEach((s) => cssMap.set(s.id, s));
        });
      }
    }
    rendered.css?.forEach((s) => cssMap.set(s.id, s));
    return {
      ...rendered,
      css: Array.from(cssMap.values()),
    };
  }
}
