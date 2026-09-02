import type { RankiAppVariant } from "_stores/anki-dist/anki.store.types.mjs";

export type RankiFilesRecord = Record<
  RankiAppVariant,
  Record<"css" | "html" | "js", string[]>
>;
