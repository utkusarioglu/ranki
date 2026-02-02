import { assertArrayNotEmpty, assertExists } from "@dqm/package-dqm-utils";
import type {
  DqmParseInputStructured,
  DqmParseTheater,
} from "@dqm/package-dqm-v2";
import { INPUT_TYPE_CLASS_SELECTOR } from "_/selector.constants.mts";
import type {
  HudTagListItem,
  RankiHudState,
} from "_components/hud/hud.types.mts";
import type {
  CardFaceArray,
  FilteredTags,
  RawFields,
} from "_config/collect/collect.types.mts";
import {
  RANKI_INTERNAL_FACE_PREFIX,
  SYSTEM_CONTROLLED_SCHEME_TOKEN,
} from "_config/config.constants.mts";
import type {
  BuildRankiBaseConfigReturn,
  CueRecord,
  ProcessedCue,
  ProcessedCueMap,
  ProcessedCueMapHud,
  RankiAppDeterminedScheme,
  RankiBaseAddressMutationMode,
  RankiBaseConfig,
  RankiCollectedConfig,
  RankiDqmConfig,
  RankiState,
} from "_config/config.types.mts";
import { RankiAppError } from "_error/ranki-app-error.mts";
import { buildAddressSegments } from "./buildAddress.mts";

export const MUTATION_MODE_PRECEDENCE: RankiBaseAddressMutationMode[] = [
  "trim",
  "hide",
  "show",
];

export function createAppConfig({ base, raw, tags }: RankiCollectedConfig) {
  const order = getFaceOrder(base.config, raw);
  const scheme = getScheme(base, raw);
  const ranki = buildRankiConfig(base, raw, tags, order, scheme);
  if (ranki.dev.throw) {
    throw new RankiAppError({
      code: "INTENTIONAL_ERROR",
      why: "The app was asked to throw this error through a trigger",
      cause: null,
      details: {
        order,
        scheme,
        ranki,
      },
    });
  }
  return ranki;
}

function getScheme(base: BuildRankiBaseConfigReturn, raw: RawFields) {
  return base.config.design.scheme === SYSTEM_CONTROLLED_SCHEME_TOKEN
    ? raw.htmlAttr.scheme
    : base.config.design.scheme;
}

function buildRankiConfig(
  base: BuildRankiBaseConfigReturn,
  raw: RawFields,
  tags: FilteredTags,
  order: CardFaceArray,
  scheme: RankiAppDeterminedScheme,
): RankiState {
  const cues = buildCues(base.cueRecord);
  const hud = buildHudConfig(base, raw, tags, cues.hud);
  const dqm = buildDqmConfig(raw, order, base.config, scheme);

  return {
    hud,
    dev: base.config.dev,
    indicator: {
      cues: cues.indicators,
      indicatorCollection: base.config.indicators,
    },
    design: {
      scheme,
      animation: base.config.design.animation,
      palette: base.config.design.palette,
      theme: base.config.design.theme,
      layout: base.config.design.layout,
      paletteCollection: base.config.palettes,
    },
    challenge: {
      face: raw.fields.face,
      order,
      dqm,
    },
  };
}

/**
 * @dev
 * #1 DECIDE For some reason anki has two different attributes for theme. one in
 * className of html and the other is data-bs-theme again in html. I'm not sure
 * which one is the correct one to use.
 */
function buildDqmConfig(
  raw: RawFields,
  order: CardFaceArray,
  config: RankiBaseConfig,
  scheme: RankiAppDeterminedScheme,
): RankiDqmConfig {
  const inputs = getInputs(
    raw,
    order.filter((v) => !v.startsWith(RANKI_INTERNAL_FACE_PREFIX)),
  );

  return {
    inputs,
    pref: { scheme },
    config: config.dqm,
  };
}

/**
 * @dev
 * #1 Becomes an icon or color only chip at the start of cue hud
 * #2 Becomes a text (and icon) based chip on the right side of the cue hud
 * #3 Becomes an indicator in the background
 */
function buildCues(cueRecord: CueRecord[]): ProcessedCueMap {
  const badges: ProcessedCue[] = [];
  const chips: ProcessedCue[] = [];
  const labels: ProcessedCue[] = [];
  const indicators: ProcessedCue[] = [];

  cueRecord.forEach((c) => {
    const icon = !!c.icon && !!c.icon.id && c.icon.id !== "none";
    const message =
      !!c.message && !!c.message.text && c.message.text !== "none";
    const background = !!c.background && c.background.color !== "none";
    const indicator = !!c.indicator && c.indicator !== "none";
    const badge = (icon || background) && !message; // #1
    const chip = icon && message; // #2
    const label = message && !icon;
    if (badge) {
      badges.push(c);
    }
    if (indicator) {
      indicators.push(c);
    }
    if (chip) {
      chips.push(c);
    }
    if (label) {
      labels.push(c);
    }
  });

  return {
    hud: {
      count: badges.length + chips.length + labels.length,
      features: {
        badges,
        chips,
        labels,
      },
    },
    indicators,
  };
}

/**
 * @dev
 * #1 DECIDE Config modules in general are handling two different tasks:
 * creating config for components and actually wrangling data for them. This is
 * fine as long as the behavior is consistent. Right now, it isn't
 */
function buildHudConfig(
  base: BuildRankiBaseConfigReturn,
  collected: RawFields,
  filteredTags: FilteredTags,
  cues: ProcessedCueMapHud,
): RankiHudState {
  const segments = buildAddressSegments(
    base.config.address.tokens,
    base.config.address.segments,
    collected.fields.deck,
  ); // #1
  const tags = buildTags(base, filteredTags);
  return {
    order: base.config.hud.order,
    visibility: base.config.hud.visibility,
    // TODO
    parser: {
      count: 3,
      hasReplacements: true,
      parseMode: "v2",
      errorLevel: "none",
    },
    address: {
      count: segments.length,
      tokens: base.config.address.tokens,
      segments,
    },
    tags,
    cues,
    card: {
      count: 3,
      type: collected.fields.type,
      card: collected.fields.card,
      face: collected.fields.face,
    },
  };
}

function buildTags(base: BuildRankiBaseConfigReturn, tags: FilteredTags) {
  const hide = base.config.tags.ranki.hide;
  const neut = tags.neutral.map((t) => ({ type: "anki" as "anki", text: t }));
  const list: HudTagListItem[] = hide
    ? neut
    : [
        ...neut,
        ...tags.ranki.map((t) => ({ type: "ranki" as "ranki", text: t })),
      ];
  return {
    list,
    count: list.length,
    neutral: tags.neutral,
    ranki: tags.ranki,
    hideRanki: base.config.tags.ranki.hide,
  };
}

function getInputs(
  raw: RawFields,
  theaterOrder: DqmParseTheater[],
): DqmParseInputStructured {
  assertArrayNotEmpty(theaterOrder, {
    why: "Given theater order has to be a non-empty array",
    details: { order: theaterOrder, face: raw.fields.face },
  });

  const inputs = theaterOrder.map((face) => {
    const r = raw.faces[face];
    if (!r) {
      throw new RankiAppError({
        code: "NO_FACE",
        why: `Cannot find face ${face}`,
        cause: null,
        details: { INPUT_TYPE_CLASS_SELECTOR, theaterOrder, face },
      });
    }
    return { theater: face, dqm: r.innerHTML };
  });
  if (!inputs.length) {
    throw new RankiAppError({
      code: "NO_FACES",
      why: "Cannot find any faces to render. Ranki requires at least one face",
      cause: null,
      details: { INPUT_TYPE_CLASS_SELECTOR, theaterOrder },
    });
  }
  return inputs;
}

function getFaceOrder(
  config: RankiBaseConfig,
  collected: RawFields,
): CardFaceArray {
  const order: undefined | CardFaceArray = config.faces[collected.fields.face];
  assertExists(order, {
    why: "Cannot process without a valid face assignment",
    details: { faces: config.faces, face: collected.fields.face },
  });
  return order;
}
