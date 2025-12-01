import type { AliasString, ChainString } from "@dqm/package-dqm-api-v2";

export type AliasCollision = {
  alias: AliasString;
  replaced: ChainString;
  current: ChainString;
};
