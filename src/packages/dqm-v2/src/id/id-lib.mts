import type {
  Alias,
  AliasString,
  Chain,
  ChainString,
  IdSummary,
} from "@dqm/package-dqm-api-v2";
import type { AliasCollision } from "./id-lib.types.mjs";
import {
  assertArrayNotEmpty,
  assertExists,
  rejectValues,
} from "@dqm/package-dqm-utils";
import { DqmAppError } from "../errors/dqm-app-error/dqm-app-error.mjs";

export class IdLib<Out> {
  private activeChains = new Map<ChainString, Out>();
  private activeAliases = new Map<AliasString, ChainString>();
  private aliasCollisions: AliasCollision[] = [];

  add(id: IdSummary, out: Out) {
    const chainString = id.chain.join(".");
    const aliasStrings = id.aliases;
    if (this.activeChains.has(chainString)) {
      throw new DqmAppError({
        code: "ALREADY_DEFINED_CHAIN",
        why: "Chains need to be unique",
        cause: null,
        details: {
          id,
          chains: this.activeChains,
        },
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
    assertArrayNotEmpty(id, {
      why: "Empty arrays do not allow discerning requested information.",
    });
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
    assertExists(obj, {
      why: "Request for an alias referenced resource that doesn't exist",
      details: { chainString },
    });
    return obj;
  }

  getObjectByChain(chain: Chain): Out {
    const obj = this.activeChains.get(chain.join(".") as ChainString);
    assertExists(obj, {
      why: "Request for a chain referenced resource that doesn't exist",
      details: { active: this.activeChains },
    });
    return obj;
  }

  peekActiveChains(): Map<ChainString, Out> {
    return this.activeChains;
  }
}
