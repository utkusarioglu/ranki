import {
  PluginComponentParser,
  PluginComponentRenderer,
  PluginComponentValidator,
  FrameTagString,
  Plugin,
  PluginComponentStage,
  PluginComponentStages,
} from "@ranki/package-api";

export class Plugins {
  private stages: PluginComponentStages[] = [];
  private plugins: Plugin[] = [];
  private tags = new Map<FrameTagString, [number, number, number]>();

  register(plugin: Plugin) {
    const pluginIndex = this.plugins.push(plugin) - 1;
    plugin.components.forEach((component) => {
      component.tags.forEach((tag, componentIndex) => {
        if (this.tags.has(tag)) {
          throw new Error(`${tag} already registered`);
        }
        this.tags.set(tag, [pluginIndex, componentIndex, -1]);
      });
    });
  }

  private getPluginIndex(tagListString) {
    if (!this.tags.has(tagListString)) {
      throw new Error(`No plugin handles tag "${tagListString}"`);
    }
    return this.tags.get(tagListString);
  }

  private async getPluginStage(
    tagListString: FrameTagString,
    stage: PluginComponentStage,
  ): Promise<PluginComponentStages[typeof stage]> {
    const [pluginIndex, componentIndex, stageIndex] =
      this.getPluginIndex(tagListString);
    if (stageIndex !== -1) {
      return this.stages[stageIndex][stage];
    }
    const stages = await this.plugins[pluginIndex].components[
      componentIndex
    ].stages();
    const newStageIndex = this.stages.push(stages) - 1;
    this.tags.set(tagListString, [pluginIndex, componentIndex, newStageIndex]);
    return stages[stage];
  }

  async getParser(tag: FrameTagString) {
    return this.getPluginStage(tag, "parser") as Promise<PluginComponentParser>;
  }

  async getRenderer(tag: FrameTagString) {
    return this.getPluginStage(
      tag,
      "renderer",
    ) as Promise<PluginComponentRenderer>;
  }

  async getValidator(tag: FrameTagString) {
    return this.getPluginStage(
      tag,
      "validator",
    ) as Promise<PluginComponentValidator>;
  }
}
