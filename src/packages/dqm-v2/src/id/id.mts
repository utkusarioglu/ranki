import type {
  Alias,
  Chain,
  IId,
  Position,
  IdSummary,
  IdUnique,
} from "@dqm/package-dqm-api-v2";
import {
  assertArrayNotEmpty,
  rejectValues,
  writeOnce,
} from "@dqm/package-dqm-utils";

export class Id implements IId {
  private static uniqueCounter = 0;
  private unique: IdUnique;
  private position!: Position;
  private id!: Alias | Chain;
  private alias!: Alias;
  private chain!: Chain;

  constructor() {
    this.unique = Id.getUnique();
  }

  private static getUnique() {
    Id.uniqueCounter++;
    return Id.uniqueCounter;
  }

  static resetUnique() {
    Id.uniqueCounter = 0;
  }

  getUnique(): IdUnique {
    return this.unique;
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
    assertArrayNotEmpty(this.id, { id });
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
