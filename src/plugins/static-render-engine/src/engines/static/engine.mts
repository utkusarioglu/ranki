import type {
  IDqmPluginRenderer,
  IDqmRenderEngine,
  IDqmRendererClientPreferences,
  RenderReport,
  RenderRoots,
  Assertions,
  DqmSerializeOutput,
  ISerializedNode,
} from "@dqm/package-dqm-api-v2";
import { RendererLibrary } from "./library.mjs";

export class DqmStaticRenderer implements IDqmRenderEngine {
  private library = new RendererLibrary();

  addPlugin(plugin: IDqmPluginRenderer): void {
    this.library.addPlugin(plugin);
  }

  private async single(
    serialized: ISerializedNode,
    pref: IDqmRendererClientPreferences,
    cbs: Assertions,
    root: HTMLElement,
  ) {
    const renderer = this.library.getPlugin(serialized.chain);
    const rn = renderer.sync(serialized, pref, cbs);
    root.appendChild(rn.element);
    if (renderer.deferred) {
      const deferred = await renderer.deferred();
      const n = deferred(serialized, pref, cbs);
      root.replaceChild(rn.element, n.element);
      // attach children here in lazy case
    } else {
      if (rn.getMount) {
        switch (serialized.kind) {
          case "parent":
            if (!rn.getMount) {
              const assertExists: Assertions["exists"] = cbs.exists;
              assertExists(rn.getMount, {
                why: "getMount needs to be defined for ISerializedNodes that have children",
              });
              throw new Error(
                "Children exist. this renderer needs to allow mounting",
              );
            }
            const mount = rn.getMount();
            serialized.children.forEach((c) =>
              this.single(c, pref, cbs, mount),
            );
        }
      }
      // attach children here in sync case
    }
  }

  async render(
    serializedOutput: DqmSerializeOutput,
    roots: RenderRoots,
    pref: IDqmRendererClientPreferences,
    cbs: Assertions,
  ): Promise<RenderReport> {
    serializedOutput.forEach(({ theater, serialized }) => {
      const root = roots[theater];
      if (!root) {
        throw new Error("root[theater] absent -> replace this error handling");
      }
      root.innerText = "";
      serialized.forEach(async (t) => this.single(t, pref, cbs, root));
    });
    return {};
  }
}
