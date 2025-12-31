import type {
  DqmTransformOutput,
  IDqmPluginRenderer,
  IDqmRenderEngine,
  IDqmRendererClientPreferences,
  RenderReport,
  RenderRoots,
  Assertions,
} from "@dqm/package-dqm-api-v2";
import { RendererLibrary } from "./library.mjs";

export class DqmStaticRenderer implements IDqmRenderEngine {
  private library = new RendererLibrary();

  addPlugin(plugin: IDqmPluginRenderer): void {
    this.library.addPlugin(plugin);
  }

  async render(
    trn: DqmTransformOutput,
    roots: RenderRoots,
    pref: IDqmRendererClientPreferences,
    cbs: Assertions,
  ): Promise<RenderReport> {
    trn.forEach(({ theater, trn }) => {
      const root = roots[theater];
      if (!root) {
        throw new Error("root[theater] absent -> replace this error handling");
      }
      root.innerText = "";
      trn.forEach(async (t) => {
        const r = this.library.getPlugin(t.chain);
        const o = r.sync(t, pref, cbs);
        root.appendChild(o.element);
        if (r.deferred) {
          const d = await r.deferred();
          const n = d(t, pref, cbs);
          root.replaceChild(o.element, n.element);
          // attach children here in lazy case
        } else {
          // attach children here in sync case
        }
      });
    });
    return {};
  }
}
