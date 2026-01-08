import type {
  Chain,
  ChainString,
  IDqmPluginRenderer,
  IDqmRenderPluginRenderer,
} from "@dqm/package-dqm-api-v2";

type RendererMap = Map<ChainString, IDqmRenderPluginRenderer>;

// type GetPluginReturn = Pick<IDqmRenderPluginRendererSync, "sync"> &
//   Partial<Pick<IDqmRenderPluginRendererLazy, "deferred">>;

const JOIN = ".";

export class RendererLibrary {
  private renderers: RendererMap = new Map();

  addPlugin(plugin: IDqmPluginRenderer) {
    plugin.list.forEach((p) => {
      this.renderers.set(p.chain.join(JOIN), p);
    });
  }

  getPlugin(chain: Chain): IDqmRenderPluginRenderer {
    const chainString = chain.join(JOIN);
    const p = this.renderers.get(chainString);
    if (!p) {
      throw new Error(`No renderer ${chainString} (REPLACE THIS ERROR)`);
    }
    return p;
    // return {
    //   sync: p.sync,
    // };
  }
}
