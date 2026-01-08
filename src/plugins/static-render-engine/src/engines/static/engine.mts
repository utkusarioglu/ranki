import type {
  IDqmPluginRenderer,
  IDqmRenderEngine,
  IDqmRendererClientPreferences,
  RenderReport,
  RenderRoots,
  Assertions,
  DqmSerializeOutput,
  ISerializedNode,
  RenderNodeCssSpec,
  RenderNode,
  // ISerializedParent,
  // RenderNodeOnMountCallback,
  // RenderNodeOnUnmountCallback,
} from "@dqm/package-dqm-api-v2";
import { RendererLibrary } from "./library.mjs";

export class DqmStaticRenderer implements IDqmRenderEngine {
  private library = new RendererLibrary();
  private css = new Map<RenderNodeCssSpec["id"], RenderNodeCssSpec>();
  // private afterMount: RenderNodeOnMountCallback[] = [];
  // private beforeUnmount: RenderNodeOnUnmountCallback[] = [];
  private head: HTMLHeadElement | null = null;

  addPlugin(plugin: IDqmPluginRenderer): void {
    this.library.addPlugin(plugin);
  }

  /**
   * @dev
   * #1 DECIDE Attaching children in the deferred and sync cases are identical here
   * but it's possible that the sync attaches its children and then delivers
   * ownership to the deferred parent. That may not be worth the effort though.
   *
   * #2 REPLACE This method of executing callbacks is likely to run into
   * issues. This needs a more global approach. Or at least two nested
   * requestAnimationFrame calls
   *
   * #3 FIX This does not currently remove the sync case CSS inclusions. They
   * need to be checked whether any other component uses them and if they
   * don't, they should be removed.
   */
  private async single(
    serialized: ISerializedNode,
    pref: IDqmRendererClientPreferences,
    cbs: Assertions,
    root: HTMLElement,
  ) {
    const renderer = this.library.getPlugin(serialized.chain);
    const sync = renderer.sync(serialized, pref, cbs);
    root.appendChild(sync.element);
    sync.css?.forEach((c) => {
      this.css.set(c.id, c);
    });
    // #2
    sync.afterMount?.forEach((f) => f());

    // #3
    if (renderer.deferred) {
      // #2
      sync.beforeUnmount?.forEach((f) => f());
      const deferred = await renderer.deferred();
      const def = deferred(serialized, pref, cbs);
      root.replaceChild(def.element, sync.element);
      def.afterMount?.forEach((f) => f());

      // #1
      this.attachChildren(serialized, pref, cbs, def);
    } else {
      // #1
      this.attachChildren(serialized, pref, cbs, sync);
    }
  }

  private attachChildren(
    serialized: ISerializedNode,
    pref: IDqmRendererClientPreferences,
    cbs: Assertions,
    node: RenderNode,
  ) {
    if (node.getMount) {
      switch (serialized.kind) {
        case "parent":
          if (!node.getMount) {
            const assertExists: Assertions["exists"] = cbs.exists;
            assertExists(node.getMount, {
              why: "getMount needs to be defined for ISerializedNodes that have children",
            });
            throw new Error(
              "Children exist. this renderer needs to allow mounting",
            );
          }
          const mount = node.getMount();
          serialized.children.forEach((c) => this.single(c, pref, cbs, mount));
      }
    }
  }

  private initialize() {
    this.css.clear();
  }

  private getHead(roots: RenderRoots) {
    if (this.head) {
      return this.head;
    }
    const firstRoot = Object.values(roots)[0];
    if (!firstRoot) {
      // REPLACE
      throw new Error("NO RENDER ROOTS: REMOVE THIS ERROR");
    }
    const head = firstRoot.ownerDocument.querySelector("head");
    if (!head) {
      // REPLACE
      throw new Error("CANNOT FIND HEAD: REMOVE THIS ERROR");
    }
    this.head = head;
    return head;
  }

  async render(
    serializedOutput: DqmSerializeOutput,
    roots: RenderRoots,
    pref: IDqmRendererClientPreferences,
    cbs: Assertions,
  ): Promise<RenderReport> {
    this.initialize();
    serializedOutput.forEach(({ theater, serialized }) => {
      const root = roots[theater];
      if (!root) {
        throw new Error(
          `theater ${theater} absent -> replace this error handling`,
        );
      }
      root.innerText = "";
      serialized.forEach(async (t) => this.single(t, pref, cbs, root));
    });

    const head = this.getHead(roots);
    for (const [id, pack] of this.css) {
      const c = document.createElement("style");
      c.id = id;
      c.innerHTML = pack.css;
      head.appendChild(c);
    }

    return {};
  }
}
