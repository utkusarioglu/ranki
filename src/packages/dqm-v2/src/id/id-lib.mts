import type {
  AliasString,
  ChainString,
  IdSummary,
} from "@dqm/package-dqm-api-v2";
import type { AliasCollision } from "./id-lib.types.mjs";
import { rejectValues } from "../utils/decorators.mjs";
import { DqmError } from "@dqm/package-utils";
import { assertExists } from "../utils/assertions.mjs";

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
  getChainByAlias(alias: AliasString): ChainString {
    return this.activeAliases.get(alias)!;
  }

  @rejectValues(undefined)
  getObjectById(id: AliasString | ChainString): Out {
    switch (id.length) {
      case 0:
        throw new DqmError("EMPTY_ARRAY", { obj: this });
      case 1:
        const chainString = this.getChainByAlias(id as AliasString);
        const obj = this.activeChains.get(chainString);
        assertExists(obj, { chainString });
        return obj;
      default:
        const obj2 = this.activeChains.get(id as ChainString);
        assertExists(obj2, { active: this.activeChains });
        return obj2;
    }
  }
}
