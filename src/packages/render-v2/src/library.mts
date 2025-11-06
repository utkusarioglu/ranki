import type { RankiPluginRenderer } from "./types/plugin.type.mjs";
import type {
  LoadedRenderCallback,
  RenderLibraryEntry,
} from "./types/library.type.mjs";

export class RenderLibrary {
  private plugins: Record<string, RankiPluginRenderer> = {};
  private static: Record<string, RenderLibraryEntry> = {};
  private loaded: Record<string, LoadedRenderCallback> = {};

  addPlugin(plugin: RankiPluginRenderer) {
    const found = this.plugins[plugin.meta.name];
    if (found) {
      throw new Error(`RENDER PLUGIN ${plugin.meta.name} ALREADY LOADED`);
    }
    this.plugins[plugin.meta.name] = plugin;
    this.addStatics(plugin);
  }

  private addStatics(plugin: RankiPluginRenderer) {
    plugin.items.forEach((item) => {
      const found = this.static[item.tag];
      if (found) {
        throw new Error(
          `RENDERER FOR ${item.tag} HAS ALREADY BEEN REGISTERED BY ${found.source}`,
        );
      }
      this.static[item.tag] = {
        item,
        source: plugin.meta.name,
      };
      if (item.load === "static") {
        this.loaded[item.tag] = item.renderer;
      }
    });
  }

  async getRenderer(tag: string): Promise<LoadedRenderCallback> {
    const lazyLoaded = this.loaded[tag];
    if (lazyLoaded) {
      return Promise.resolve(lazyLoaded);
    }
    const staticLoaded = this.static[tag];
    if (!staticLoaded) {
      throw new Error(`RENDERER ${tag} DOES NOT EXIST`);
    }
    if (staticLoaded.item.load === "static") {
      throw new Error(
        `RENDERER ${tag} WASN'T LOADED EVEN THOUGH IT'S STATIC. THIS POINTS TO A DESIGN ERROR`,
      );
    }
    const ready = await staticLoaded.item.renderer();
    this.loaded[tag] = ready;
    return ready;
  }
}
