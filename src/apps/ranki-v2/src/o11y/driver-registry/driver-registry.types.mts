import type { LogDriver } from "../log/ranki-logging.types.mjs";

export interface LogDriverConstructor {
  new (p: any): LogDriver;
}

export type RankiLogDriverRegistryAddManyProps = Record<
  string,
  LogDriverConstructor
>;
