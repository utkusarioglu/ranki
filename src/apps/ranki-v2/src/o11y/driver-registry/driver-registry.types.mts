import type { LogDriver } from "../log/ranki-logging.types.mjs";

export interface LogDriverConstructor {
  new (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    p: any,
  ): LogDriver;
}

export type RankiLogDriverRegistryAddManyProps = Record<
  string,
  LogDriverConstructor
>;
