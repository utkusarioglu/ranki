export type Position = number & { type?: "IdPosition" };

export type IdUnique = string & { type?: "IdUnique" };

export type IIdMap = {
  position: Chain[];
  alias: Map<Alias, Chain>;
};

export interface IId {
  setPosition(pos: Position): IId;
  // setMap(mapping: IIdMap): IId;
  setId(id: Alias | Chain): IId;
  setChain(chain: Chain): IId;
  getUnique(): IdUnique;
  setAlias(alias: Alias): IId;

  getSummary(): IdSummary;
  getId(): Alias | Chain;
  getAlias(): Alias | undefined;
  getChain(): Chain;
  getPosition(): Position | undefined;
}

export type Chain = string[] & { type?: "Chain" };

export type ChainList = Chain[] & { type?: "ChainList" };

export type ChainString = string & { type?: "ChainString" };

export type Alias = [string] & { type?: "Alias" };

export type AliasString = string & { type?: "AliasString" };

export type AliasStringList = AliasString[];

export type IdList = (Chain | Alias)[];

export interface IdSummary {
  chain: Chain;
  aliases: AliasStringList;
}
