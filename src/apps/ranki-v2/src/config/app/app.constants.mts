import type { RankiBaseAddressMutationMode } from "_config/config.types.mjs";

export const MUTATION_MODE_PRECEDENCE: RankiBaseAddressMutationMode[] = [
  "trim",
  "hide",
  "show",
];
