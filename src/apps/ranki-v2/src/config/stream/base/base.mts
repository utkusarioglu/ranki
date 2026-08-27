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

import { DEFAULT_PRECEDENCE_ORDER } from "./base.constants.mjs";
import { checkIfMatch } from "./determine.mjs";

export class BaseConfig {
  private baseC: Config;
  private channels: RankiChannelsConfig;
  private cueRecord: CueRecord[] = [];
  private precedenceOrder: CueKind[];
  private raw: RawFields;
  private tags: FilteredTags;

  constructor(
    channels: RankiChannelsConfig,
    tags: FilteredTags,
    raw: RawFields,
  ) {
    this.precedenceOrder = DEFAULT_PRECEDENCE_ORDER;
    this.channels = channels;
    this.tags = tags;
    this.raw = raw;
    this.baseC = new Config("app");
    this.cueRecord = [];
  }

  public build(): BuildRankiBaseConfigReturn {
    this.baseC.pushConfig("default", this.channels.base);

    this.precedenceOrder.forEach((kind) => {
      this.processKind(kind);
    });

    const config = this.baseC
      .mergeTo("merged")
      .getConfig<RankiBaseConfig>("merged");
    return { config, cueRecord: this.cueRecord };
  }

  private processKind(kind: CueKind) {
    switch (kind) {
      case "always":
        this.channels.always.forEach((always) => {
          this.pushAlways(kind, always);
        });
        break;
      case "card":
        this.pushMatch(kind, this.raw.fields.card, this.channels.cards);
        break;
      case "deck":
        this.pushMatch(kind, this.raw.fields.deck, this.channels.decks);
        break;
      case "face":
        this.pushMatch(kind, this.raw.fields.face, this.channels.faces);
        break;
      case "flag":
        this.pushFlag(this.channels, this.raw);
        break;
      case "tag:marked":
        this.pushMarked(kind, this.tags.marked, this.channels.tags);
        break;
      case "tag:neutral":
        this.pushTag(kind, this.tags.neutral, this.channels.tags);
        break;
      case "tag:ranki":
        this.pushTag(kind, this.tags.ranki, this.channels.tags);
        break;
      case "type":
        this.pushMatch(kind, this.raw.fields.type, this.channels.types);
        break;
      case "webview":
        this.pushMatch(kind, this.raw.htmlAttr.webview, this.channels.webview);
        break;
      default:
        assertNever({
          details: { kind },
          why: "All possible cue kinds have been depleted",
        });
    }
  }

  private pushAlways(kind: CueKind, matched: DeckAlwaysSettings) {
    const ISSUER = "always";
    if (matched.config) {
      this.baseC.pushConfig(kind, matched.config);
    }
    if (matched.cue) {
      this.cueRecord.push({ issuer: ISSUER, type: kind, ...matched.cue });
    }
  }

  private pushFlag(channels: RankiChannelsConfig, raw: RawFields) {
    const KIND = "flag";
    const flagColorIndex = +raw.fields.flag.slice(-1) as AnkiFlagColorIndices;
    const issuer = FLAG_COLOR_ORDER[flagColorIndex]! as AnkiFlagColors;
    Object.entries(channels.flags).forEach(([color, common]) => {
      if (issuer !== color) return;
      if (common.config) {
        this.baseC.pushConfig(`${KIND}:${color}`, common.config);
      }
      if (common.cue) {
        this.cueRecord.push({ issuer, type: KIND, ...common.cue });
      }
    });
  }

  private pushMarked(kind: CueKind, marked: boolean, tags: DeckSettings[]) {
    if (!marked) return;
    const ISSUER = "marked";
    const matched = tags.find(
      (v) =>
        //@ts-expect-error TODO maybe other modes should be supported too
        v.exact === ISSUER,
    );
    if (!matched) return;
    if (matched.config) {
      this.baseC.pushConfig(kind, matched.config);
    }
    if (matched.cue) {
      this.cueRecord.push({ issuer: ISSUER, type: kind, ...matched.cue });
    }
  }

  private pushMatch(kind: CueKind, issuer: string, matchers: DeckSettings[]) {
    const matched = checkIfMatch(issuer, matchers);
    if (!matched) return;
    if (matched.config) {
      this.baseC.pushConfig(kind, matched.config);
    }
    if (matched.cue) {
      this.cueRecord.push({ issuer, type: kind, ...matched.cue });
    }
  }

  private pushTag(
    kind: CueKind,
    source: AnkiNeutralTags | RankiTags,
    tags: DeckSettings[],
  ) {
    source.forEach((issuer) => {
      const matched = checkIfMatch(issuer, tags);
      if (!matched) return;
      if (matched.config) {
        this.baseC.pushConfig(`${kind}:${issuer}`, matched.config);
      }
      if (matched.cue) {
        this.cueRecord.push({ issuer, type: kind, ...matched.cue });
      }
    });
  }
}
