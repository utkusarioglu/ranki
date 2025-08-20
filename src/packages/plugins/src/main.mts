import {
  PluginComponentParser,
  PluginComponentRenderer,
  PluginComponentValidator,
  ParseType,
  Plugin,
  // PluginComponentStageName,
  // PluginComponentStages,
  PluginComponentTransformer,
  RankiPlugins,
  ValidationType,
  TransformType,
  RenderType,
} from "@ranki/package-api";
import { StageLibrary } from "./stage-library.mjs";

// export class PluginsOld implements RankiPlugins {
//   private stages: PluginComponentStageName[] = [];
//   private plugins: Plugin[] = [];
//   private tags = new Map<ParseType, [number, number, number]>();

//   register(plugin: Plugin) {
//     const pluginIndex = this.plugins.push(plugin) - 1;
//     plugin.components.forEach((component, componentIndex) => {
//       component.tags.forEach((tag) => {
//         if (this.tags.has(tag)) {
//           throw new Error(`${tag} already registered`);
//         }
//         this.tags.set(tag, [pluginIndex, componentIndex, -Infinity]);
//       });
//     });
//   }

//   private getPluginIndex(tagListString) {
//     if (!this.tags.has(tagListString)) {
//       throw new Error(`No plugin handles tag "${tagListString}"`);
//     }
//     return this.tags.get(tagListString);
//   }

//   private async getPluginStage(
//     tagListString: ParseType,
//     stage: PluginComponentStageName,
//   ): Promise<PluginComponentStages[typeof stage]> {
//     const [pluginIndex, componentIndex, stageIndex] =
//       this.getPluginIndex(tagListString);
//     if (stageIndex !== -Infinity) {
//       return this.stages[stageIndex][stage];
//     }
//     const stages = await this.plugins[pluginIndex].components[
//       componentIndex
//     ].stages();
//     const newStageIndex = this.stages.push(stages) - 1;
//     this.tags.set(tagListString, [pluginIndex, componentIndex, newStageIndex]);
//     return stages[stage];
//   }

//   async getParser(tag: ParseType) {
//     return this.getPluginStage(tag, "parser") as Promise<PluginComponentParser>;
//   }

//   async getRenderer(tag: ParseType) {
//     return this.getPluginStage(
//       tag,
//       "renderer",
//     ) as Promise<PluginComponentRenderer>;
//   }

//   async getValidator(tag: ParseType) {
//     return this.getPluginStage(
//       tag,
//       "validator",
//     ) as Promise<PluginComponentValidator>;
//   }
//   async getTransformer(tag: ParseType) {
//     return this.getPluginStage(
//       tag,
//       "transformer",
//     ) as Promise<PluginComponentTransformer>;
//   }
// }

export class Plugins implements RankiPlugins {
  private plugins: Plugin[] = [];
  private parsers = new StageLibrary<ParseType, PluginComponentParser>();
  private validators = new StageLibrary<
    ValidationType,
    PluginComponentValidator
  >();
  private transformers = new StageLibrary<
    TransformType,
    PluginComponentTransformer
  >();
  private renderers = new StageLibrary<RenderType, PluginComponentRenderer>();

  register(plugin: Plugin): void {
    this.plugins.push(plugin);
    plugin.components.forEach(
      ({ parser, validator, transformer, renderer }) => {
        this.parsers.insertStage(parser);
        this.validators.insertStage(validator);
        this.transformers.insertStage(transformer);
        this.renderers.insertStage(renderer);
      },
    );
  }

  getParser(tag: ParseType): Promise<PluginComponentParser> {
    return this.parsers.getAction(tag);
  }

  getValidator(tag: ParseType): Promise<PluginComponentValidator> {
    return this.validators.getAction(tag);
  }

  getTransformer(tag: ParseType): Promise<PluginComponentTransformer> {
    return this.transformers.getAction(tag);
  }

  getRenderer(tag: ParseType): Promise<PluginComponentRenderer> {
    return this.renderers.getAction(tag);
  }
}
