import type { Alias, Chain } from "@dqm/package-dqm-api-v2";
import { Id } from "../../id/id.mjs";

export function idCapability<T>(self: T) {
  const id = new Id();

  return {
    setId(i: Alias | Chain): T {
      id.setId(i);
      return self;
    },
    setAlias: id.setAlias.bind(id),
    setPosition: id.setPosition.bind(id),
    getId: id.getId.bind(id),
    getIdString: id.getIdString.bind(id),
    getAlias: id.getAlias.bind(id),
    getAliasString: id.getAliasString.bind(id),
    getChain: id.getChain.bind(id),
    getChainString: id.getChainString.bind(id),
  };
}
