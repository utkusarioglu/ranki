import { Config } from "@dqm/package-dqm-utils";
import type {
  AnkiFlagColorIndices,
  AnkiFlagColors,
  BuildRankiBaseConfigReturn,
  CueKind,
  CueRecord,
  DeckSettings,
  RankiBaseConfig,
  RankiChannelsConfig,
} from "_config/config.types.mts";
import type {
  RawFields,
  FilteredTags,
  AnkiNeutralTags,
  RankiTags,
} from "_config/collect/collect.types.mts";
import { checkIfMatch } from "./determine.mts";
import { FLAG_COLOR_ORDER } from "_config/anki.constants.mts";
import { assertNever } from "_error/assertions.mts";

const PRECEDENCE_ORDER: CueKind[] = [
  "deck",
  "card",
  "type",
  "face",
  "flag",
  "tag:neutral",
  "tag:ranki",
  "tag:marked",
];

export function buildBaseConfig(
  channels: RankiChannelsConfig,
  tags: FilteredTags,
  raw: RawFields,
): BuildRankiBaseConfigReturn {
  const baseC = new Config("app");
  const cueRecord: CueRecord[] = [];
  baseC.pushConfig("default", channels.base);

  PRECEDENCE_ORDER.forEach((kind) => {
    switch (kind) {
      case "card":
        pushMatch(baseC, cueRecord, kind, raw.fields.card, channels.cards);
        break;
      case "deck":
        pushMatch(baseC, cueRecord, kind, raw.fields.deck, channels.decks);
        break;
      case "type":
        pushMatch(baseC, cueRecord, kind, raw.fields.type, channels.types);
        break;
      case "face":
        pushMatch(baseC, cueRecord, kind, raw.fields.face, channels.faces);
        break;
      case "flag":
        pushFlag(baseC, cueRecord, channels, raw);
        break;
      case "tag:neutral":
        pushTag(baseC, cueRecord, kind, tags.neutral, channels.tags);
        break;
      case "tag:ranki":
        pushTag(baseC, cueRecord, kind, tags.ranki, channels.tags);
        break;
      case "tag:marked":
        pushMarked(baseC, cueRecord, kind, tags.marked, channels.tags);
        break;
      default:
        assertNever({
          why: "All possible cue kinds have been depleted",
          details: { kind },
        });
    }
  });

  const config = baseC.mergeTo("merged").getConfig<RankiBaseConfig>("merged");
  return { config, cueRecord };
}

function pushMarked(
  baseC: Config,
  cueRecord: CueRecord[],
  kind: CueKind,
  marked: boolean,
  tags: DeckSettings[],
) {
  if (!marked) return;
  const issuer = "marked";
  const matched = tags.find(
    (v) =>
      //@ts-expect-error TODO maybe other modes should be supported too
      v.exact === issuer,
  );
  if (matched) {
    matched.config && baseC.pushConfig(kind, matched.config);
    matched.cue && cueRecord.push({ type: kind, issuer, ...matched.cue });
  }
}

function pushTag(
  baseC: Config,
  cueRecord: CueRecord[],
  kind: CueKind,
  source: AnkiNeutralTags | RankiTags,
  tags: DeckSettings[],
) {
  source.forEach((issuer) => {
    const matched = checkIfMatch(issuer, tags);
    if (!matched) return;
    matched.config && baseC.pushConfig(`${kind}:${issuer}`, matched.config);
    matched.cue && cueRecord.push({ type: kind, issuer, ...matched.cue });
  });
}

function pushFlag(
  baseC: Config,
  cueRecord: CueRecord[],
  channels: RankiChannelsConfig,
  raw: RawFields,
) {
  const flagColorIndex = +raw.fields.flag.slice(-1) as AnkiFlagColorIndices;
  const issuer = FLAG_COLOR_ORDER[flagColorIndex]! as AnkiFlagColors;
  Object.entries(channels.flags).forEach(([color, common]) => {
    if (issuer !== color) return;
    const kind = "flag";
    common.config && baseC.pushConfig(`${kind}:${color}`, common.config);
    common.cue && cueRecord.push({ type: kind, issuer, ...common.cue });
  });
}

function pushMatch(
  baseC: Config,
  cueRecord: CueRecord[],
  kind: CueKind,
  issuer: string,
  matchers: DeckSettings[],
) {
  const matched = checkIfMatch(issuer, matchers);
  if (!matched) return;
  matched.config && baseC.pushConfig(kind, matched.config);
  matched.cue && cueRecord.push({ type: kind, issuer, ...matched.cue });
}
