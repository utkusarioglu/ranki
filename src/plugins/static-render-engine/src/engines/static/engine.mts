import type {
  IDqmPluginRenderer,
  IDqmRenderEngine,
  IDqmRendererClientPreferences,
  RenderReport,
  RenderRoots,
  DqmSerializeOutput,
  ISerializedNode,
  RenderNodeCssSpec,
  RenderNode,
  Assertions,
  IAstNodeKind,
  RenderFunctionParams,
} from "@dqm/package-dqm-api-v2";
import { RendererLibrary } from "./library.mjs";
import { defineSreTheater, type DqmSreTheater } from "./sre-theater.mjs";

// type CssMap = Map<RenderNodeCssSpec["id"], RenderNodeCssSpec>;
type PushCssCallback = (css: RenderNodeCssSpec) => void;

// TODO move this to a better place
defineSreTheater();
export class DqmStaticRenderer implements IDqmRenderEngine {
  private library = new RendererLibrary();
  private assertions: Assertions;

  constructor(assertions: Assertions) {
    this.assertions = assertions;
  }

  addPlugin(plugin: IDqmPluginRenderer): void {
    this.library.addPlugin(plugin);
  }

  private produceRenderNode<T>(
    kind: IAstNodeKind,
    ser: T,
    pref: IDqmRendererClientPreferences,
    callback: (p: RenderFunctionParams<T>) => RenderNode,
  ) {
    let sync: RenderNode;
    switch (kind) {
      case "parent":
        const assertParent: Assertions["parent"] = this.assertions.parent;
        // @ts-expect-error
        assertParent(ser, {
          why: "Renderer only accepts parent trn nodes",
          details: { ser },
        });
        sync = callback({ ser, pref });
        break;
      case "leaf":
        const assertLeaf: Assertions["leaf"] = this.assertions.leaf;
        // @ts-expect-error
        assertLeaf(ser, {
          why: "Renderer only accepts leaf trn nodes",
          details: { ser },
        });
        sync = callback({ ser, pref });
        break;
      default:
        const assertNever: Assertions["never"] = this.assertions.never;
        assertNever({
          why: "Renderer assigned an unrecognized `kind` type",
          details: { kind },
        });
    }
    return sync;
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
    root: HTMLElement | DocumentFragment,
    pushCss: PushCssCallback,
  ) {
    const renderer = this.library.getPlugin(serialized.chain);
    const kind = renderer.kind;
    let sync = this.produceRenderNode(
      kind,
      serialized,
      pref,
      // @ts-expect-error
      (a) => renderer.sync(a),
    );
    root.appendChild(sync.element);
    sync.css?.forEach((c) => {
      pushCss(c);
    });
    // #2
    sync.afterMount?.forEach((f) => f());

    // #3
    if (renderer.deferred) {
      // #2
      sync.beforeUnmount?.forEach((f) => f());
      const deferred = await renderer.deferred();

      const def = this.produceRenderNode(
        kind,
        serialized,
        pref,
        // @ts-expect-error
        (a) => deferred(a),
      );
      root.replaceChild(def.element, sync.element);
      def.afterMount?.forEach((f) => f());

      // #1
      this.attachChildren(serialized, pref, def, pushCss);
    } else {
      // #1
      this.attachChildren(serialized, pref, sync, pushCss);
    }
  }

  private attachChildren(
    serialized: ISerializedNode,
    pref: IDqmRendererClientPreferences,
    node: RenderNode,
    pushCss: PushCssCallback,
  ) {
    if (node.getMount) {
      switch (serialized.kind) {
        case "parent":
          if (!node.getMount) {
            const assertExists: Assertions["exists"] = this.assertions.exists;
            assertExists(node.getMount, {
              why: "getMount needs to be defined for ISerializedNodes that have children",
            });
            throw new Error(
              "Children exist. this renderer needs to allow mounting",
            );
          }
          const mount = node.getMount();
          serialized.children.forEach((c) =>
            this.single(c, pref, mount, pushCss),
          );
      }
    }
  }

  async render(
    serializedOutput: DqmSerializeOutput,
    roots: RenderRoots,
    pref: IDqmRendererClientPreferences,
  ): Promise<RenderReport> {
    console.log("ser", serializedOutput);
    serializedOutput.forEach(({ theater, serialized }) => {
      const root = roots.theaters[theater]();
      if (!root) {
        throw new Error(
          `theater ${theater} absent -> replace this error handling`,
        );
      }
      const sreTheater = document.createElement(
        "dqm-sre-theater",
      ) as DqmSreTheater;
      const key = serialized.map((v) => v.key).join("-");
      sreTheater.setAttribute("dqm-key", key);
      sreTheater.setAttribute("dqm-theater", theater);
      root.replaceChildren(sreTheater);
      root.setAttribute("dqm-key", key);
      root.setAttribute("dqm-theater", theater);
      const container = document.createElement("div");
      sreTheater.setTheater(container);

      const pushCss: PushCssCallback = (spec) => sreTheater.setStyle(spec);
      serialized.forEach(async (t) => this.single(t, pref, container, pushCss));
    });

    return Promise.resolve({ finished: true });
  }
}
