import type {
  Alias,
  AliasString,
  Chain,
  ChainString,
  DqmPluginName,
  IDqmPluginGrammar,
  IDqmPluginTypeNames,
  IdString,
  PluginUrn,
  TransformClass,
} from "@dqm/package-dqm-api-v2";

const CHAIN_SEPARATOR = ".";
const ID_SEPARATOR = "-";
const ALIAS_SEPARATOR = "_";
const TRANSFORM_CLASS = ":";

export class Serialize {
  static grammarName(p: IDqmPluginGrammar): PluginUrn<"grammar"> {
    return `grammar:${p.meta.name}`;
  }

  static getPluginName<T extends IDqmPluginTypeNames>(
    pluginUrn: PluginUrn<T>,
  ): DqmPluginName {
    return pluginUrn.split(":").at(-1)!;
  }

  static chain(c: Chain): ChainString {
    return c.join(CHAIN_SEPARATOR);
  }

  static alias(a: Alias): AliasString {
    return a.join(ALIAS_SEPARATOR);
  }

  static id(i: Alias | Chain): IdString {
    return i.join(ID_SEPARATOR);
  }

  static transformClassUrn(chain: Chain, tc: TransformClass) {
    return [Serialize.chain(chain), tc].join(TRANSFORM_CLASS);
  }
}
