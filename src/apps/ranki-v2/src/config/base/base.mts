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
} from "../config.types.mts";
import type {
  RawFields,
  FilteredTags,
  AnkiNeutralTags,
  RankiTags,
} from "../collect/collect.types.mts";
import { checkIfMatch } from "./determine.mts";
import { FLAG_COLOR_ORDER } from "../anki.constants.mts";
import { assertNever } from "../../error/assertions.mts";

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

// export function buildBaseConfig_old(
//   channels: RankiChannelsConfig,
//   tags: FilteredTags,
//   raw: RawFields,
// ): BuildRankiBaseConfigReturn {
//   const baseC = new Config("app");
//   const cueRecord: CueRecord[] = [];
//   baseC.pushConfig("default", channels.base);

//   [
//     {
//       kind: "deck" as "deck",
//       issuer: raw.fields.deck,
//       matchers: channels.decks,
//     },
//     {
//       kind: "card" as "card",
//       issuer: raw.fields.card,
//       matchers: channels.cards,
//     },
//     {
//       kind: "type" as "type",
//       issuer: raw.fields.type,
//       matchers: channels.types,
//     },
//     {
//       kind: "face" as "face",
//       issuer: raw.fields.face,
//       matchers: channels.faces,
//     },
//   ].forEach(({ kind, issuer, matchers }) => {
//     const matched = checkIfMatch(issuer, matchers);
//     if (!matched) return;
//     matched.config && baseC.pushConfig(kind, matched.config);
//     matched.cue && cueRecord.push({ kind, issuer, ...matched.cue });
//   });

//   const flagColorIndex = +raw.fields.flag.slice(-1) as AnkiFlagColorIndices;
//   const issuer = FLAG_COLOR_ORDER[flagColorIndex]! as AnkiFlagColors;
//   Object.entries(channels.flags).forEach(([color, common]) => {
//     if (issuer !== color) return;
//     const kind = "flag";
//     common.config && baseC.pushConfig(`${kind}:${color}`, common.config);
//     common.cue && cueRecord.push({ kind, issuer, ...common.cue });
//   });

//   tags.neutral.forEach((issuer) => {
//     const matched = checkIfMatch(issuer, channels.tags);
//     if (!matched) return;
//     const kind = "tag:neutral";
//     matched.config && baseC.pushConfig(`${kind}:${issuer}`, matched.config);
//     matched.cue && cueRecord.push({ kind, issuer, ...matched.cue });
//   });

//   tags.ranki.forEach((issuer) => {
//     const matched = checkIfMatch(issuer, channels.tags);
//     if (!matched) return;
//     const kind = "tag:ranki";
//     matched.config && baseC.pushConfig(`${kind}:${issuer}`, matched.config);
//     matched.cue && cueRecord.push({ kind, issuer, ...matched.cue });
//   });

//   if (tags.marked) {
//     const issuer = "marked";
//     const kind = "tag:marked";
//     const matched = channels.tags.find((v) => v.exact === issuer);
//     if (matched) {
//       matched.config && baseC.pushConfig("tag:marked", matched.config);
//       matched.cue && cueRecord.push({ kind, issuer, ...matched.cue });
//     }
//   }

//   const config = baseC.mergeTo("merged").getConfig<RankiBaseConfig>("merged");
//   return { config, cueRecord };
// }

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
        // pushTag(baseC, cueRecord, kind, [tags.marked], channels.tags);
        break;
      default:
        assertNever({
          why: "All possible cue kinds have been depleted",
          details: { kind },
        });
    }
  });
  // [
  // ,
  /* {
      kind: "deck" as "deck",
      issuer: raw.fields.deck,
      matchers: channels.decks,
    },
    {
      kind: "card" as "card",
      issuer: raw.fields.card,
      matchers: channels.cards,
    } */ // {
  //   kind: "type" as "type",
  //   issuer: raw.fields.type,
  //   matchers: channels.types,
  // },
  // {
  //   kind: "face" as "face",
  //   issuer: raw.fields.face,
  //   matchers: channels.faces,
  // },
  // ].forEach(({ kind, issuer, matchers }) => {
  //   const matched = checkIfMatch(issuer, matchers);
  //   if (!matched) return;
  //   matched.config && baseC.pushConfig(kind, matched.config);
  //   matched.cue && cueRecord.push({ kind, issuer, ...matched.cue });
  // });

  // const flagColorIndex = +raw.fields.flag.slice(-1) as AnkiFlagColorIndices;
  // const issuer = FLAG_COLOR_ORDER[flagColorIndex]! as AnkiFlagColors;
  // Object.entries(channels.flags).forEach(([color, common]) => {
  //   if (issuer !== color) return;
  //   const kind = "flag";
  //   common.config && baseC.pushConfig(`${kind}:${color}`, common.config);
  //   common.cue && cueRecord.push({ kind, issuer, ...common.cue });
  // });

  // tags.neutral.forEach((issuer) => {
  //   const matched = checkIfMatch(issuer, channels.tags);
  //   if (!matched) return;
  //   const kind = "tag:neutral";
  //   matched.config && baseC.pushConfig(`${kind}:${issuer}`, matched.config);
  //   matched.cue && cueRecord.push({ kind, issuer, ...matched.cue });
  // });

  // tags.ranki.forEach((issuer) => {
  //   const matched = checkIfMatch(issuer, channels.tags);
  //   if (!matched) return;
  //   const kind = "tag:ranki";
  //   matched.config && baseC.pushConfig(`${kind}:${issuer}`, matched.config);
  //   matched.cue && cueRecord.push({ kind, issuer, ...matched.cue });
  // });

  // if (tags.marked) {
  //   const issuer = "marked";
  //   const kind = "tag:marked";
  //   const matched = channels.tags.find((v) => v.exact === issuer);
  //   if (matched) {
  //     matched.config && baseC.pushConfig("tag:marked", matched.config);
  //     matched.cue && cueRecord.push({ kind, issuer, ...matched.cue });
  //   }
  // }

  const config = baseC.mergeTo("merged").getConfig<RankiBaseConfig>("merged");
  return { config, cueRecord };
}

function pushMarked(
  baseC: Config,
  cueRecord: CueRecord[],
  kind: CueKind,
  marked: boolean,
  // source: AnkiNeutralTags | RankiTags,
  tags: DeckSettings[],
) {
  if (!marked) return;
  const issuer = "marked";
  // const kind = "tag:marked";
  const matched = tags.find((v) => v.exact === issuer);
  if (matched) {
    matched.config && baseC.pushConfig(kind, matched.config);
    matched.cue && cueRecord.push({ kind, issuer, ...matched.cue });
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
    // const kind = `tag:${type}` as CueKind;
    matched.config && baseC.pushConfig(`${kind}:${issuer}`, matched.config);
    matched.cue && cueRecord.push({ kind, issuer, ...matched.cue });
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
    common.cue && cueRecord.push({ kind, issuer, ...common.cue });
  });
}

function pushMatch(
  baseC: Config,
  cueRecord: CueRecord[],
  kind: CueKind,
  issuer: string,
  matchers: DeckSettings[],
  // matched: DeckSettings | undefined,
) {
  const matched = checkIfMatch(issuer, matchers);
  if (!matched) return;
  if (!matched) return;
  matched.config && baseC.pushConfig(kind, matched.config);
  matched.cue && cueRecord.push({ kind, issuer, ...matched.cue });
}

// function checkDeck(issuer: string, matchers: DeckSettings[]) {
//   // const kind = "deck";

//   const matched = checkIfMatch(issuer, matchers);
//   if (!matched) return;
//   matched.config && baseC.pushConfig(kind, matched.config);
//   matched.cue && cueRecord.push({ kind, issuer, ...matched.cue });
// }
