import type {
  Alias,
  Chain,
  IId,
  Position,
  IdSummary,
  UniqueValue,
  AliasString,
  ChainString,
  IdString,
} from "@dqm/package-dqm-api-v2";
import {
  assertArrayNotEmpty,
  rejectValues,
  writeOnce,
} from "@dqm/package-dqm-utils";
import { Unique } from "../unique/unique.mjs";

export const ID_SEPARATOR = "-";
export const ALIAS_SEPARATOR = "_";
export const CHAIN_SEPARATOR = ".";

export class Id implements IId {
  // private static uniqueCounter = 0;
  private uniqueValue: UniqueValue;
  private position!: Position;
  private id!: Alias | Chain;
  private alias!: Alias;
  private chain!: Chain;

  constructor() {
    this.uniqueValue = Unique.getNewUnique();
  }

  // private static getUnique() {
  //   Id.uniqueCounter++;
  //   return Id.uniqueCounter;
  // }

  // static resetUnique() {
  //   Id.uniqueValue = 0;
  // }

  getUnique(): UniqueValue {
    return this.uniqueValue;
  }

  /**
   * @dev
   * #1 This shouldn't matter. aliases by definition are of length 1.
   * But for safety a separator is still defined to be able to distinguish any
   * possible issues..
   */
  getAliasString(): AliasString {
    return this.alias.join(ALIAS_SEPARATOR); // #1
  }

  getChainString(): ChainString {
    return this.chain.join(CHAIN_SEPARATOR);
  }

  getIdString(): IdString {
    return this.id.join(ID_SEPARATOR);
  }

  getSummary(): IdSummary {
    const aliases = this.alias ? [this.alias.join(".")] : [];
    return {
      aliases,
      chain: this.chain,
    };
  }

  @writeOnce("position")
  setPosition(pos: Position): IId {
    this.position = pos;
    return this;
  }

  getPosition(): Position | undefined {
    return this.position;
  }

  @writeOnce("id")
  setId(id: Alias | Chain): IId {
    this.id = id;
    assertArrayNotEmpty(this.id, {
      why: "Empty arrays do not allow discerning the requested information",
      details: { id },
    });
    switch (id.length) {
      case 1:
        this.setAlias(id as Alias);
        break;
      default:
        this.setChain(id as Chain);
    }
    return this;
  }

  @writeOnce("chain")
  setChain(chain: Chain): IId {
    this.chain = chain;
    return this;
  }

  @writeOnce("alias")
  setAlias(alias: Alias): IId {
    this.alias = alias;
    return this;
  }

  getId(): Alias | Chain {
    return this.id;
  }

  getAlias(): Alias {
    return this.alias;
  }

  @rejectValues(undefined)
  getChain(): Chain {
    return this.chain;
  }
}
