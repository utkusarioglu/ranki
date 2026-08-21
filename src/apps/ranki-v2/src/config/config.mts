import type { RankiCollectedConfig, RankiTagPrefix } from "./config.types.mjs";
import { buildChannelsConfig } from "./channels/channels.mjs";
import { buildBaseConfig } from "./base/base.mjs";
import type {
  AnkiMarked,
  AnkiNeutralTags,
  AnkiRawTag,
  FilteredTags,
  RankiTag,
  RankiTags,
  RawFields,
} from "_/collect/collect.types.mjs";

export function collectConfig(raw: RawFields): RankiCollectedConfig {
  const channels = buildChannelsConfig(raw);
  const tags = groupTags(raw, channels.base.tags.ranki.prefix);
  const base = buildBaseConfig(channels, tags, raw);
  return { base, tags };
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
