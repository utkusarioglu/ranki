import type {
  RawFields,
  FilteredTags,
  CardFaceArray,
} from "../collect/collect.types.mts";
import type { HudProps } from "../../components/hud/hud.types.mts";
import type {
  RankiBaseConfig,
  RankiAppDeterminedScheme,
  RankiAppConfig,
  RankiDqmConfig,
  AnkiFlagColors,
  BuildRankiBaseConfigReturn,
} from "../config.types.mts";
import type {
  DqmParseInputStructured,
  DqmParseTheater,
} from "@dqm/package-dqm-v2";
import { assertArrayNotEmpty, assertExists } from "@dqm/package-dqm-utils";
import { RankiAppError } from "../../error/ranki-app-error.mts";
import { INPUT_TYPE_CLASS_SELECTOR } from "../../selector.constants.mts";
import {
  NO_FLAG_COLOR_TOKEN,
  RANKI_INTERNAL_FACE_PREFIX,
  SYSTEM_CONTROLLED_SCHEME_TOKEN,
} from "../config.constants.mts";

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
    ? raw.htmlAttr.dataBsTheme // #1
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
function buildHudConfig(
  base: BuildRankiBaseConfigReturn,
  collected: RawFields,
  tags: FilteredTags,
): HudProps {
  const flag = base.cueRecord.find((v) => v.kind === "flag");
  const marked = base.cueRecord.find((v) => v.kind === "tag:marked");
  return {
    order: base.config.hud.order,
    visibility: base.config.hud.visibility,
    // TODO
    parser: {
      hasReplacements: true,
      parseMode: "v2",
      errorLevel: "none",
    },
    // TODO
    address: {
      prefix: [],
      exposed: collected.address,
      suffix: [],
    },
    tags: {
      count: base.config.tags.ranki.hide
        ? tags.neutral.length
        : tags.neutral.length + tags.ranki.length,
      neutral: tags.neutral,
      ranki: tags.ranki,
      hideRanki: base.config.tags.ranki.hide,
    },
    // TODO maybe you need tag messages here
    review: {
      marked: marked && {
        message: marked.message,
      },
      flag: {
        color: (flag?.issuer || NO_FLAG_COLOR_TOKEN) as AnkiFlagColors,
        message: flag?.message || "",
      },
    },
    card: {
      type: collected.fields.type,
      card: collected.fields.card,
      face: collected.fields.face,
    },
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
