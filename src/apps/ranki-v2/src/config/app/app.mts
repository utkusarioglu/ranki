import type {
  RawFields,
  FilteredTags,
  CardFaceArray,
} from "../collect/collect.types.mts";
import type {
  HudProps,
  HudTagListItem,
} from "../../components/hud/hud.types.mts";
import type {
  RankiBaseConfig,
  RankiAppDeterminedScheme,
  RankiAppConfig,
  RankiDqmConfig,
  BuildRankiBaseConfigReturn,
  RankiBaseAddressMutationMode,
  CueRecord,
} from "../config.types.mts";
import type {
  DqmParseInputStructured,
  DqmParseTheater,
} from "@dqm/package-dqm-v2";
import { assertArrayNotEmpty, assertExists } from "@dqm/package-dqm-utils";
import { RankiAppError } from "../../error/ranki-app-error.mts";
import { INPUT_TYPE_CLASS_SELECTOR } from "../../selector.constants.mts";
import {
  RANKI_INTERNAL_FACE_PREFIX,
  SYSTEM_CONTROLLED_SCHEME_TOKEN,
} from "../config.constants.mts";
import { buildAddressSegments as buildAddressParts } from "./buildAddress.mts";

export const MUTATION_MODE_PRECEDENCE: RankiBaseAddressMutationMode[] = [
  "trim",
  "hide",
  "show",
];

export function createAppConfig(
  base: BuildRankiBaseConfigReturn,
  raw: RawFields,
  tags: FilteredTags,
) {
  const order = getFaceOrder(base.config, raw);
  const scheme = getScheme(base, raw);
  const ranki = buildRankiConfig(base, raw, tags, order, scheme);
  const dqm = buildDqmConfig(raw, order, base.config, scheme);
  return { ranki, dqm };
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
): RankiAppConfig {
  const hud = buildHudConfig(base, raw, tags);
  return {
    hud,
    dev: {
      methods: base.config.dev.methods,
    },
    design: {
      cueRecord: base.cueRecord,
      scheme,
      animation: base.config.design.animation,
      palette: base.config.design.palette,
      theme: base.config.design.theme,
      layout: base.config.design.layout,
    },
    face: raw.fields.face,
    order,
    palettes: base.config.palettes,
    indicators: base.config.indicators,
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
 * Removes flag0 cue if it doesn't have a message
 *
 * TODO if color is added to the hud, then this needs to check for the presence of color
 */
function buildCues(cueRecord: CueRecord[]): CueRecord[] {
  return cueRecord.filter(
    (v) => v.issuer !== "none" || (v.issuer === "none" && v.message),
  );
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
): HudProps {
  const segments = buildAddressParts(
    base.config.address.tokens,
    base.config.address.segments,
    collected.fields.deck,
  ); // #1
  const cues = buildCues(base.cueRecord);
  const tags = buildTags(base, filteredTags);
  // const tagList = buildTags();
  return {
    order: base.config.hud.order,
    visibility: base.config.hud.visibility,
    // TODO
    parser: {
      hasReplacements: true,
      parseMode: "v2",
      errorLevel: "none",
    },
    address: {
      tokens: base.config.address.tokens,
      segments,
    },
    tags,
    cues,
    card: {
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
