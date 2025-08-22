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
export class Plugins implements RankiPlugins {
  private plugins: Plugin[] = [];
  private parsers = new StageLibrary<ParseType, PluginComponentParser>(
    "parser",
  );
  private validators = new StageLibrary<
    ValidationType,
    PluginComponentValidator
  >("validator");
  private transformers = new StageLibrary<
    TransformType,
    PluginComponentTransformer
  >("transformer");
  private renderers = new StageLibrary<RenderType, PluginComponentRenderer>(
    "renderer",
  );

  // TODO this doesn't await plugin loads.
  // you need many layers of promise.alls to have this thing load everything
  register(plugin: Plugin): void {
    this.plugins.push(plugin);
    plugin.components.forEach(
      ({ parser, validator, transformer, renderer }) => {
        this.parsers.insertStage(parser, plugin.metadata);
        this.validators.insertStage(validator, plugin.metadata);
        this.transformers.insertStage(transformer, plugin.metadata);
        this.renderers.insertStage(renderer, plugin.metadata);
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
