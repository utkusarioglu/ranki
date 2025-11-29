import type { AliasString, ChainString } from "@ranki/package-dqm-api-v2";

export type AliasCollision = {
  alias: AliasString;
  replaced: ChainString;
  current: ChainString;
};
