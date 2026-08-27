import type { CueKind } from "_config/config.types.mjs";

// TODO maybe os, scheme, dir, env types could be considered here as well.
export const DEFAULT_PRECEDENCE_ORDER: CueKind[] = [
  "webview",
  "deck",
  "card",
  "type",
  "face",
  "flag",
  "tag:neutral",
  "tag:ranki",
  "tag:marked",
  "always",
];
