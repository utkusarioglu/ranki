import type { Alias, Chain, IdSummary } from "@ranki/package-dqm-api-v2";
import type { AliasCollision } from "./id-lib.types.mjs";
import { nonNullable } from "../decorators.mjs";
import { DqmError } from "@ranki/package-utils";
import { assertExists } from "../libs/utils.mjs";

export class IdLib<Out> {
  private activeChains = new Map<Chain, Out>();
  private activeAliases = new Map<Alias, Chain>();
  private aliasCollisions: AliasCollision[] = [];

  add(id: IdSummary, out: Out) {
    if (this.activeChains.has(id.chain)) {
      throw new DqmError("ALREADY_DEFINED_CHAIN", {
        id,
        chains: this.activeChains,
      });
    }
    this.activeChains.set(id.chain, out);

    id.aliases.forEach((aliasString) => {
      const preexisting = this.activeAliases.get([aliasString]);
      if (preexisting) {
        this.aliasCollisions.push({
          alias: [aliasString],
          replaced: preexisting,
          current: id.chain,
        });
      }
      this.activeAliases.set([aliasString], id.chain);
    });
  }

  @nonNullable
  getChainByAlias(alias: Alias): Chain {
    return this.activeAliases.get(alias)!;
  }

  @nonNullable
  getObjectById(id: Alias | Chain): Out {
    switch (id.length) {
      case 0:
        throw new DqmError("EMPTY_ARRAY", { obj: this });
      case 1:
        const chain = this.getChainByAlias(id as Alias);
        const obj = this.activeChains.get(chain);
        assertExists(obj, chain.join("."));
        return obj;
      default:
        const obj2 = this.activeChains.get(id as Chain);
        assertExists(obj2, id.join("."));
        return obj2;
    }
  }
}
