import type {
  AnkiNeutralTags,
  FilteredTags,
  RankiTags,
  RawFields,
} from "_collect/collect.types.mjs";
import type {
  AnkiFlagColorIndices,
  AnkiFlagColors,
  BuildRankiBaseConfigReturn,
  CueKind,
  CueRecord,
  DeckAlwaysSettings,
  DeckSettings,
  RankiBaseConfig,
  RankiChannelsConfig,
} from "_config/config.types.mjs";

import { FLAG_COLOR_ORDER } from "_/anki.constants.mjs";
import { assertNever } from "_error/assertions.mjs";
import { Config } from "@dqm/package-dqm-utils";

import { PRECEDENCE_ORDER } from "./base.constants.mjs";
import { checkIfMatch } from "./determine.mjs";

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
      case "always":
        channels.always.forEach((always) => {
          pushAlways(baseC, cueRecord, kind, always);
        });
        break;
      case "card":
        pushMatch(baseC, cueRecord, kind, raw.fields.card, channels.cards);
        break;
      case "deck":
        pushMatch(baseC, cueRecord, kind, raw.fields.deck, channels.decks);
        break;
      case "face":
        pushMatch(baseC, cueRecord, kind, raw.fields.face, channels.faces);
        break;
      case "flag":
        pushFlag(baseC, cueRecord, channels, raw);
        break;
      case "tag:marked":
        pushMarked(baseC, cueRecord, kind, tags.marked, channels.tags);
        break;
      case "tag:neutral":
        pushTag(baseC, cueRecord, kind, tags.neutral, channels.tags);
        break;
      case "tag:ranki":
        pushTag(baseC, cueRecord, kind, tags.ranki, channels.tags);
        break;
      case "type":
        pushMatch(baseC, cueRecord, kind, raw.fields.type, channels.types);
        break;
      case "webview":
        pushMatch(
          baseC,
          cueRecord,
          kind,
          raw.htmlAttr.webview,
          channels.webview,
        );
        break;
      default:
        assertNever({
          details: { kind },
          why: "All possible cue kinds have been depleted",
        });
    }
  });

  const config = baseC.mergeTo("merged").getConfig<RankiBaseConfig>("merged");
  return { config, cueRecord };
}

function pushAlways(
  baseC: Config,
  cueRecord: CueRecord[],
  kind: CueKind,
  matched: DeckAlwaysSettings,
) {
  const issuer = "always";
  if (matched.config) baseC.pushConfig(kind, matched.config);
  if (matched.cue) cueRecord.push({ issuer, type: kind, ...matched.cue });
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
    if (common.config) baseC.pushConfig(`${kind}:${color}`, common.config);
    if (common.cue) cueRecord.push({ issuer, type: kind, ...common.cue });
  });
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
    if (matched.config) baseC.pushConfig(kind, matched.config);
    if (matched.cue) cueRecord.push({ issuer, type: kind, ...matched.cue });
  }
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
  if (matched.config) baseC.pushConfig(kind, matched.config);
  if (matched.cue) cueRecord.push({ issuer, type: kind, ...matched.cue });
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
    if (matched.config) baseC.pushConfig(`${kind}:${issuer}`, matched.config);
    if (matched.cue) cueRecord.push({ issuer, type: kind, ...matched.cue });
  });
}
