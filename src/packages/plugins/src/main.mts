import domPlugin from "@ranki/plugin-dom";
import {
  PluginComponentParser,
  PluginComponentRenderer,
  PluginComponentValidator,
  FrameTagString,
  Plugin,
} from "@ranki/package-api";

export class Plugins {
  register(plugin: Plugin) {
    return this;
  }
  getParser(tag: FrameTagString): PluginComponentParser {
    return domPlugin.components[0].parser;
  }
  getRenderer(tag: FrameTagString): PluginComponentRenderer {
    return domPlugin.components[0].renderer;
  }
  getValidator(tag: FrameTagString): PluginComponentValidator {
    return domPlugin.components[0].validator;
  }
}
