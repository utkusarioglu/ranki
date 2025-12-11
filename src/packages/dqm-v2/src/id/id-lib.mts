import type {
  Alias,
  AliasString,
  Chain,
  ChainString,
  IdSummary,
} from "@dqm/package-dqm-api-v2";
import type { AliasCollision } from "./id-lib.types.mjs";
import {
  DqmError,
  assertArrayNotEmpty,
  assertExists,
  rejectValues,
} from "@dqm/package-utils";

export class IdLib<Out> {
  private activeChains = new Map<ChainString, Out>();
  private activeAliases = new Map<AliasString, ChainString>();
  private aliasCollisions: AliasCollision[] = [];

  add(id: IdSummary, out: Out) {
    const chainString = id.chain.join(".");
    const aliasStrings = id.aliases;
    if (this.activeChains.has(chainString)) {
      throw new DqmError("ALREADY_DEFINED_CHAIN", {
        id,
        chains: this.activeChains,
      });
    }
    this.activeChains.set(chainString, out);

    aliasStrings.forEach((aliasString) => {
      const preexisting = this.activeAliases.get(aliasString);
      if (preexisting) {
        this.aliasCollisions.push({
          alias: aliasString,
          replaced: preexisting,
          current: chainString,
        });
      }
      this.activeAliases.set(aliasString, chainString);
    });
  }

  @rejectValues(undefined)
  getChainByAlias(alias: Alias): ChainString {
    return this.activeAliases.get(alias.join("."))!;
  }

  @rejectValues(undefined)
  getObjectById(id: Alias | Chain): Out {
    assertArrayNotEmpty(id, {});
    switch (id.length) {
      case 1:
        return this.getObjectByAlias(id as Alias);
      default:
        return this.getObjectByChain(id as Chain);
    }
  }

  getObjectByAlias(alias: Alias): Out {
    const chainString = this.getChainByAlias(alias);
    const obj = this.activeChains.get(chainString);
    assertExists(obj, { chainString });
    return obj;
  }

  getObjectByChain(chain: Chain): Out {
    const obj = this.activeChains.get(chain.join(".") as ChainString);
    assertExists(obj, { active: this.activeChains });
    return obj;
  }
}
