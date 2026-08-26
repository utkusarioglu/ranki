import type {
  RawFields,
  FilteredTags,
  CardFaceArray,
} from "_collect/collect.types.mjs";
import type {
  RankiHudStateAnimation,
  RankiHudState,
  HudTagListItem,
} from "_components/hud/hud.types.mjs";
import { RANKI_INTERNAL_FACE_PREFIX } from "_config/config.constants.mjs";
import type {
  BuildRankiBaseConfigReturn,
  RankiAppDeterminedScheme,
  RankiState,
  RankiDqmConfig,
  RankiChallengeState,
  CueRecord,
  ProcessedCueMap,
  ProcessedCue,
  RankiBaseConfig,
  ProcessedCueMapHud,
  RankiIndicatorState,
  RankiAnimation,
} from "_config/config.types.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import { buildAddressSegments } from "./buildAddress.mjs";
import type {
  DqmParseInputStructured,
  DqmParseTheater,
} from "@dqm/package-dqm-v2";
import { assertArrayNotEmpty } from "_error/assertions.mjs";
import { INPUT_TYPE_CLASS_SELECTOR } from "_/selector.constants.mjs";

export function buildRankiConfig(
  base: BuildRankiBaseConfigReturn,
  raw: RawFields,
  tags: FilteredTags,
  order: CardFaceArray,
  scheme: RankiAppDeterminedScheme,
): RankiState {
  const hudAnimation = getAnimation(base, "hud");

  const cues = buildCues(base.cueRecord, hudAnimation);
  const hud = buildHudConfig(base, raw, tags, cues.hud, hudAnimation);
  const dqm = buildDqmConfig(raw, order, base.config, scheme);
  const indicator = buildIndicatorConfig(cues, base);

  return {
    challenge: buildChallengeConfig(base, raw, order, dqm),
    design: {
      animation: base.config.design.animation,
      animationCollection: base.config.animations,
      layout: base.config.design.layout,
      palette: base.config.design.palette,
      paletteCollection: base.config.palettes,
      scheme,
      theme: base.config.design.theme,
    },
    dev: base.config.dev,
    hud,
    indicator,
  };
}
function buildChallengeConfig(
  base: BuildRankiBaseConfigReturn,
  raw: RawFields,
  order: CardFaceArray,
  dqm: RankiDqmConfig,
): RankiChallengeState {
  const animation = getAnimation(base, "challenge");
  return {
    animation,
    dqm,
    face: raw.fields.face,
    order,
  };
}
/**
 * @dev
 * #1 Becomes an icon or color only chip at the start of cue hud
 * #2 Becomes a text (and icon) based chip on the right side of the cue hud
 * #3 Becomes an indicator in the background
 */
function buildCues(
  cueRecord: CueRecord[],
  animation: RankiHudStateAnimation,
): ProcessedCueMap {
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
      badges.push({ animation, ...c });
    }
    if (indicator) {
      indicators.push({ animation, ...c });
    }
    if (chip) {
      chips.push({ animation, ...c });
    }
    if (label) {
      labels.push({ animation, ...c });
    }
  });

  return {
    hud: {
      animation,
      count: badges.length + chips.length + labels.length,
      subtree: {
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
    config: config.dqm,
    inputs,
    pref: { scheme },
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
  animation: RankiHudStateAnimation,
): RankiHudState {
  const segments = buildAddressSegments(
    base.config.address.tokens,
    base.config.address.segments,
    collected.fields.deck,
  ); // #1
  const tags = buildTags(base, filteredTags, animation);
  return {
    animation,
    order: base.config.hud.order,
    subtree: {
      address: {
        animation,
        count: segments.length,
        segments,
        tokens: base.config.address.tokens,
      },
      cues,
      // TODO
      notify: {
        animation,
        count: 3,
        errorLevel: "none",
        hasReplacements: true,
        parseMode: "v2",
      },
      tags,
      template: {
        animation,
        card: collected.fields.card,
        count: 3,
        face: collected.fields.face,
        type: collected.fields.type,
      },
    },
    visibility: base.config.hud.visibility,
  };
}
function buildIndicatorConfig(
  cues: ProcessedCueMap,
  base: BuildRankiBaseConfigReturn,
): RankiIndicatorState {
  // const enabled = base.config.design.animation.enabled;
  // const animation = base.config.design.animation.indicator;
  // animation.enabled = animation.enabled && enabled;
  const animation = getAnimation(base, "indicator");
  return {
    animation,
    cues: cues.indicators,
    indicatorCollection: base.config.indicators,
  };
}
function buildTags(
  base: BuildRankiBaseConfigReturn,
  tags: FilteredTags,
  animation: RankiHudStateAnimation,
) {
  const hide = base.config.tags.ranki.hide;
  const neut = tags.neutral.map((t) => ({
    animation,
    text: t,
    type: "anki" as const,
  }));
  const list: HudTagListItem[] = hide
    ? neut
    : [
        ...neut,
        ...tags.ranki.map((t) => ({
          animation,
          text: t,
          type: "ranki" as const,
        })),
      ];
  return {
    animation,
    count: list.length,
    hideRanki: base.config.tags.ranki.hide,
    list,
    neutral: tags.neutral,
    ranki: tags.ranki,
  };
}
function getAnimation(
  base: BuildRankiBaseConfigReturn,
  type: keyof Omit<RankiAnimation, "enabled" | "fade">,
): RankiHudStateAnimation {
  const baseAnimation = base.config.design.animation.enabled === true;
  const typeAnimation = base.config.design.animation[type];
  // baseHudAnimation.enabled =
  return {
    ...typeAnimation,
    enabled: typeAnimation.enabled === true && baseAnimation,
  };
}
function getInputs(
  raw: RawFields,
  theaterOrder: DqmParseTheater[],
): DqmParseInputStructured {
  assertArrayNotEmpty(theaterOrder, {
    details: { face: raw.fields.face, order: theaterOrder },
    why: "Given theater order has to be a non-empty array",
  });

  const inputs = theaterOrder.map((face) => {
    const r = raw.faces[face];
    if (!r) {
      throw new RankiAppError({
        cause: null,
        code: "NO_FACE",
        details: { face, INPUT_TYPE_CLASS_SELECTOR, theaterOrder },
        why: `Cannot find face ${face}`,
      });
    }
    return { dqm: r.innerHTML, theater: face };
  });
  if (!inputs.length) {
    throw new RankiAppError({
      cause: null,
      code: "NO_FACES",
      details: { INPUT_TYPE_CLASS_SELECTOR, theaterOrder },
      why: "Cannot find any faces to render. Ranki requires at least one face",
    });
  }
  return inputs;
}
