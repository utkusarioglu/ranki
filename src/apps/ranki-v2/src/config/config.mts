import type {
  AnkiMarked,
  AnkiNeutralTags,
  AnkiRawTag,
  RawFields,
  FilteredTags,
  RankiTag,
  RankiTags,
} from "./collect/collect.types.mjs";
import type {
  RankiState,
  RankiCollectedConfig,
  RankiTagPrefix,
} from "./config.types.mts";
import { buildChannelsConfig } from "./channels/channels.mts";
import { buildBaseConfig } from "./base/base.mts";
import { createAppConfig } from "./app/app.mts";
import { collectRaw } from "./collect/collect.mts";

export async function collectConfig(): Promise<RankiCollectedConfig> {
  const raw = await collectRaw();
  const channels = buildChannelsConfig(raw);
  const tags = groupTags(raw, channels.base.tags.ranki.prefix);
  const base = buildBaseConfig(channels, tags, raw);
  return { base, raw, tags };
}

export function createState(collected: RankiCollectedConfig): RankiState {
  return createAppConfig(collected);
}

function groupTags(
  collected: RawFields,
  rankiTagPrefix: RankiTagPrefix,
): FilteredTags {
  const tagsArr = collected.fields.tags
    .trim()
    .split(" ")
    .filter((v) => v.length);
  const ranki = [] as RankiTags;
  const neutral = [] as AnkiNeutralTags;
  let marked = false as AnkiMarked;
  tagsArr.forEach((t) => {
    if (t.startsWith(rankiTagPrefix)) {
      ranki.push(t as RankiTag);
    } else if (t === "marked") {
      marked = true as AnkiMarked;
    } else {
      neutral.push(t as AnkiRawTag);
    }
  });
  return { neutral, ranki, marked };
}
