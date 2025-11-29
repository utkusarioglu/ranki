import type { Alias, Chain } from "@ranki/package-dqm-api-v2";

export type AliasCollision = {
  alias: Alias;
  replaced: Chain;
  current: Chain;
};
