import type { UniqueValue } from "../unique/unique.types.mjs";

export type Position = number & { type?: "IdPosition" };

// export type IdUnique = number & { type?: "IdUnique" };

export type IdString = string & { type?: "IdString" };
export type IdStringList = IdString[] & { type?: "IdStringList" };
export type IdListString = string & { type?: "IdListString" };

export type IIdMap = {
  position: Chain[];
  alias: Map<Alias, Chain>;
};

export interface IId {
  setPosition(pos: Position): IId;
  // setMap(mapping: IIdMap): IId;
  setId(id: Alias | Chain): IId;
  setChain(chain: Chain): IId;
  getUnique(): UniqueValue;
  setAlias(alias: Alias): IId;

  getSummary(): IdSummary;

  getId(): Alias | Chain;
  getIdString(): IdString;

  getAlias(): Alias | undefined;
  getAliasString(): AliasString;

  getChain(): Chain;
  getChainString(): ChainString;

  getPosition(): Position | undefined;
}

export type Chain = string[] & { type?: "Chain" };

export type ChainList = Chain[] & { type?: "ChainList" };

export type ChainString = string & { type?: "ChainString" };
export type ChainStringList = ChainString[] & { type?: "ChainStringList" };
export type ChainListString = string & { type?: "ChainListString" };

export type Alias = [string] & { type?: "Alias" };
export type AliasList = (Alias | undefined)[] & { type?: "AliasList" };

export type AliasString = string & { type?: "AliasString" };
export type AliasListString = string & { type?: "AliasListString" };

export type AliasStringList = AliasString[];

export type IdList = (Chain | Alias)[];

export interface IdSummary {
  chain: Chain;
  aliases: AliasStringList;
}
