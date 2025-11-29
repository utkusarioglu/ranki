import type {
  Alias,
  Chain,
  IIdMap,
  IId,
  Position,
  IdSummary,
} from "@ranki/package-dqm-api-v2";
import { nonNullable, writeOnce } from "../utils/decorators.mjs";
import { DqmError } from "@ranki/package-utils";

export class Id implements IId {
  private map!: IIdMap;
  private position!: Position;
  private id!: Alias | Chain;
  private alias!: Alias;
  private chain!: Chain;

  getSummary(): IdSummary {
    const aliases = this.alias ? [this.alias.join(".")] : [];
    return {
      aliases,
      chain: this.chain,
    };
  }

  setPosition(pos: Position): IId {
    this.position = pos;
    return this;
  }

  getPosition(): Position | undefined {
    return this.position;
  }

  setMap(map: IIdMap): IId {
    this.map = map;
    this.processAlias();
    this.processPosition();
    return this;
  }

  private processPosition() {
    if (!this.position) {
      return;
    }
    if (this.map.position.length < this.position + 1) {
      throw new DqmError("UNDEFINED_ID_POSITION", {
        position: this.position,
        positions: this.map.position,
        obj: this,
      });
    }
    this.chain = this.map.position[this.position];
  }

  private processAlias() {
    switch (this.id.length) {
      case 0:
        throw new DqmError("EMPTY_ARRAY", { obj: this });
      case 1:
        const alias = this.id as Alias;
        this.setAlias(alias);
        const chain = this.map.alias.get(alias);
        if (!chain) {
          throw new DqmError("UNDEFINED_CHAIN", {
            alias,
            mapping: this.map,
          });
        }
        this.setChain(chain);
        break;
      default:
        this.setChain(this.id as Chain);
    }
  }

  @writeOnce("id")
  setId(id: Alias | Chain): IId {
    this.id = id;
    return this;
  }

  setChain(chain: Chain): IId {
    this.chain = chain;
    return this;
  }

  private setAlias(alias: Alias): IId {
    this.alias = alias;
    return this;
  }

  getId(): Alias | Chain {
    return this.id;
  }

  getAlias(): Alias {
    return this.alias;
  }

  @nonNullable()
  getChain(): Chain {
    return this.chain;
  }
}
