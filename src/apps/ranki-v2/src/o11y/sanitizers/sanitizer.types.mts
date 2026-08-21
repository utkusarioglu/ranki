import type { LogValue } from "../log/ranki-logging.types.mjs";

export type SanitizerFunc = (
  v: unknown[],
  seen?: WeakSet<object>,
) => LogValue[];
