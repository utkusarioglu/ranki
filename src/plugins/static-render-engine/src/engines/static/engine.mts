import type {
  DqmTransformOutput,
  IDqmPluginRenderer,
  IDqmRenderEngine,
  IDqmRendererClientPreferences,
  RenderReport,
  RenderRoots,
} from "@dqm/package-dqm-api-v2";
import { RendererLibrary } from "./library.mjs";

export class DqmStaticRenderer implements IDqmRenderEngine {
  private library = new RendererLibrary();

  addPlugin(plugin: IDqmPluginRenderer): void {
    this.library.addPlugin(plugin);
  }

  render(
    trn: DqmTransformOutput,
    roots: RenderRoots,
    pref: IDqmRendererClientPreferences,
  ): RenderReport {
    trn.forEach(({ theater, trn }) => {
      const root = roots[theater];
      if (!root) {
        throw new Error("root[theater] absent -> replace this error handling");
      }
      root.innerText = "";
      trn.forEach((t) => {
        const r = this.library.getPlugin(t.chain);
        const o = r.sync(t, pref);
        root.appendChild(o.element);
        // t.chain;
      });
      // const elem = document.createElement("div");
      // elem.innerText = trn
      //   .map((t) => {
      //     switch (t.kind) {
      //       case "parent":
      //         return "parent";
      //       case "leaf":
      //         return t.source;
      //     }
      //   })
      //   .join("\n\n");
      // root.innerText = "";
      // root.appendChild(elem);
    });
    return {};
  }
}
