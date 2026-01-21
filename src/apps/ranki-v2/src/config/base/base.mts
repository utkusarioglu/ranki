import { Config } from "@dqm/package-dqm-utils";
import type {
  AnkiFlagColorIndices,
  AnkiFlagColors,
  BuildRankiBaseConfigReturn,
  CueRecord,
  RankiBaseConfig,
  RankiChannelsConfig,
} from "../config.types.mts";
import type { RawFields, FilteredTags } from "../collect/collect.types.mts";
import { checkIfMatch } from "./determine.mts";
import { FLAG_COLOR_ORDER } from "../anki.constants.mts";

export function buildBaseConfig(
  channels: RankiChannelsConfig,
  tags: FilteredTags,
  raw: RawFields,
): BuildRankiBaseConfigReturn {
  const baseC = new Config("app");
  const cueRecord: CueRecord[] = [];
  baseC.pushConfig("default", channels.base);
  [
    {
      kind: "deck" as "deck",
      issuer: raw.fields.deck,
      matchers: channels.decks,
    },
    {
      kind: "card" as "card",
      issuer: raw.fields.card,
      matchers: channels.cards,
    },
    {
      kind: "type" as "type",
      issuer: raw.fields.type,
      matchers: channels.types,
    },
    {
      kind: "face" as "face",
      issuer: raw.fields.face,
      matchers: channels.faces,
    },
  ].forEach(({ kind, issuer, matchers }) => {
    const matched = checkIfMatch(issuer, matchers);
    if (!matched) return;
    matched.config && baseC.pushConfig(kind, matched.config);
    matched.cue && cueRecord.push({ kind, issuer, ...matched.cue });
  });

  const flagColorIndex = +raw.fields.flag.slice(-1) as AnkiFlagColorIndices;
  const issuer = FLAG_COLOR_ORDER[flagColorIndex]! as AnkiFlagColors;
  Object.entries(channels.flags).forEach(([color, common]) => {
    if (issuer !== color) return;
    const kind = "flag";
    common.config && baseC.pushConfig(`${kind}:${color}`, common.config);
    common.cue && cueRecord.push({ kind, issuer, ...common.cue });
  });

  tags.neutral.forEach((issuer) => {
    const matched = checkIfMatch(issuer, channels.tags);
    if (!matched) return;
    const kind = "tag:neutral";
    matched.config && baseC.pushConfig(`${kind}:${issuer}`, matched.config);
    matched.cue && cueRecord.push({ kind, issuer, ...matched.cue });
  });

  tags.ranki.forEach((issuer) => {
    const matched = checkIfMatch(issuer, channels.tags);
    if (!matched) return;
    const kind = "tag:ranki";
    matched.config && baseC.pushConfig(`${kind}:${issuer}`, matched.config);
    matched.cue && cueRecord.push({ kind, issuer, ...matched.cue });
  });

  if (tags.marked) {
    const issuer = "marked";
    const kind = "tag:marked";
    const matched = channels.tags.find((v) => v.exact === issuer);
    if (matched) {
      matched.config && baseC.pushConfig("tag:marked", matched.config);
      matched.cue && cueRecord.push({ kind, issuer, ...matched.cue });
    }
  }

  const config = baseC.mergeTo("merged").getConfig<RankiBaseConfig>("merged");
  return { config, cueRecord };
}
