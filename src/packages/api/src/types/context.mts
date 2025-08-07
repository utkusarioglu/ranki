import type {
  FrameTagString,
  Plugin,
  PluginComponentParser,
  PluginComponentRenderer,
  PluginComponentTransformer,
  PluginComponentValidator,
} from "./plugin.mjs";

export interface RankiPlugins {
  register(plugin: Plugin): void;
  getParser(tag: FrameTagString): Promise<PluginComponentParser>;
  getRenderer(tag: FrameTagString): Promise<PluginComponentRenderer>;
  getValidator(tag: FrameTagString): Promise<PluginComponentValidator>;
  getTransformer(tag: FrameTagString): Promise<PluginComponentTransformer>;
}

export interface RankiConfig {
  version: "v1" | "v2";
  metadata: {
    deck: string;
    subdeck: string;
    tags: string;
    type: string;
    flag: string;
    card: string;
  };
  tokens: {
    negation: string;
    sep_parameter: string;
    sep_argument: string;
    assignment: string;
    quote_single: string;
    quote_double: string;
    directive: string;
    frame: string;
    pause: string;
    h: string;
    em: string;
    b: string;
    i: string;
  };
}

export interface RankiContext {
  plugins: RankiPlugins;
  config: RankiConfig;
  root: {
    parsers: {
      document: PluginComponentParser;
      directive: PluginComponentParser;
    };
  };
  language: {
    createActions: Function;
    produceGrammar: Function;
  };
}

export type TokenValue = string;
