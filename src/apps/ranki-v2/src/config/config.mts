import yaml from "yaml";
import { Config } from "@dqm/package-dqm-utils";
import { RANKI_INITIAL_CONFIG } from "./config.constants.mts";
import type { RankiConfig } from "../export.types.mts";
import type { DqmParseInputStructured } from "@dqm/package-dqm-v2";
import type {
  AnkiDeck,
  AnkiMarked,
  AnkiNeutralTags,
  AnkiRawTag,
  CardFaceArray,
  ConfigLocations,
  DataCollection,
  FilteredTags,
  RankiTag,
  RankiTags,
} from "../collect/collect.types.mjs";
import {
  INPUT_TYPE_CLASS_SELECTOR,
  RANKI_TAG_INDICATOR,
} from "../selector.constants.mjs";
import { assertArrayNotEmpty, assertExists } from "@dqm/package-dqm-utils";
import { RankiAppError } from "../error/ranki-app-error.mts";
import type { Conf } from "./config.types.mts";
import type { HudProps } from "../components/hud/hud.types.mts";
import { DQM_BASE_CONFIG } from "./dqm.constants.mjs";
import type {
  AnkiFlagColorIndices,
  AnkiFlagColors,
  DeckSettings,
  MatchTypes,
  RankiBaseConfig,
  RankiBaseConfigPartial,
  RankiGlobalConfigPartial,
} from "../types/config.types.mts";
import { assertNever } from "../error/assertions.mts";

const FACE_ASSIGNMENTS = { Q: ["A"], N: ["A", "B"] };

function determineMatchType<T extends Record<MatchTypes, {}>>(
  a: T,
): MatchTypes | "multi" {
  const isExact = a.exact !== undefined;
  const isRegex = a.regex !== undefined;
  const isGlob = a.glob !== undefined;
  const manyMatch = [isExact, isRegex, isGlob].filter((v) => v).length > 1;
  if (manyMatch) {
    return "multi";
  } else if (isExact) {
    return "exact";
  } else if (isRegex) {
    return "regex";
  } else if (isGlob) {
    return "glob";
  } else {
    throw new RankiAppError({
      code: "UNKNOWN_MATCHER",
      why: "Unrecognized matcher returned",
      cause: null,
      details: { item: a },
    });
  }
}

// function determineTagConfig(userTags: FilteredTags, globalConfig: RankiConfig) {
//   const configs: RankiBaseConfigPartial[] = [];
//   globalConfig.tags.forEach((tag) => {

//   })
// }
function determineDeckConfig(
  currentDeck: AnkiDeck,
  globalConfig: RankiConfig,
): DeckSettings | undefined {
  for (const deck of globalConfig.decks) {
    const matchType = determineMatchType(deck);
    if (matchType === "multi") {
      throw new RankiAppError({
        code: "DECK_MULTIPLE_MATCHERS",
        why: "Deck spec can only define one of glob, regex, exact",
        cause: null,
        details: { deck },
      });
    }
    switch (matchType) {
      case "exact":
        if (deck.exact === currentDeck) {
          return deck;
        }
        break;
      default:
        assertNever({
          why: "Unrecognized match type",
          details: { matchType, deck },
        });
    }
  }
  return undefined;
}

export function createConfigs(collected: DataCollection): Conf {
  const globalConfig = buildGlobalConfig(collected);
  const rankiConfig = new Config();
  rankiConfig.pushConfig("default", globalConfig.base);

  const appConfig = new Config();
  appConfig.pushConfig("default", globalConfig.base);
  const bucket: RankiBaseConfigPartial[] = [];
  const deckConfig = determineDeckConfig(collected.fields.deck, globalConfig);
  if (deckConfig) {
    appConfig.pushConfig("deck", deckConfig.config);
    bucket.push(deckConfig.config);
  }
  const config = appConfig
    .mergeTo("merged")
    .getConfig<RankiBaseConfig>("merged");

  console.log("co", config, bucket);

  const tags = filterTags(collected);
  const hud = buildHudConfig(config, collected, tags);
  const order = getFaceOrder(collected);
  const inputs = getInputs(collected, order);

  return {
    ranki: {
      hud,
      order,
    },
    dqm: {
      inputs,
      pref: { scheme: "dark" },
      config: [DQM_BASE_CONFIG],
    },
  };
}

function getFaceOrder(collected: DataCollection): CardFaceArray {
  const order: undefined | CardFaceArray =
    // @ts-expect-error
    FACE_ASSIGNMENTS[collected.fields.face];
  assertExists(order, {
    why: "Cannot process without a valid face assignment",
    details: { FACE_ASSIGNMENTS, face: collected.fields.face },
  });
  return order;
}

function parseConfig(
  name: string,
  configStr: string,
): RankiGlobalConfigPartial {
  try {
    return yaml.parse(configStr);
  } catch (e) {
    throw new RankiAppError({
      code: "CONFIG_PARSE_FAIL",
      why: "Yaml parse operation of config failed",
      cause: e,
      details: { name, configStr },
    });
  }
}

function buildGlobalConfig(collected: DataCollection): RankiConfig {
  const gConfig = new Config().pushConfig("default", RANKI_INITIAL_CONFIG);
  const configOrder = ["user", "template", "card"] as ConfigLocations[];

  configOrder.forEach((loc) => {
    const c = collected.config[loc];
    assertExists(c, {
      why: "Required config location absent",
      details: { loc },
    });
    const parsed = parseConfig(loc, c);
    if (parsed !== null) {
      gConfig.pushConfig(loc, parsed);
    }
  });

  const merged = gConfig.mergeTo("merged").getConfig<RankiConfig>("merged");

  return merged;
}

function getInputs(
  collected: DataCollection,
  theaterOrder: CardFaceArray,
): DqmParseInputStructured {
  assertArrayNotEmpty(theaterOrder, {
    why: "Given theater order has to be a non-empty array",
    details: { FACE_ASSIGNMENTS, face: collected.fields.face },
  });

  const inputs = theaterOrder.map((face) => {
    const r = collected.faces[face];
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

function filterTags(collected: DataCollection): FilteredTags {
  const tagsArr = collected.fields.tags
    .trim()
    .split(" ")
    .filter((v) => v.length);
  const rankiTags = [] as RankiTags;
  const neutralTags = [] as AnkiNeutralTags;
  let marked = false as AnkiMarked;
  tagsArr.forEach((t) => {
    if (t.startsWith(RANKI_TAG_INDICATOR)) {
      rankiTags.push(t as RankiTag);
    } else if (t === "marked") {
      marked = true as AnkiMarked;
    } else {
      neutralTags.push(t as AnkiRawTag);
    }
  });
  return { neutral: neutralTags, ranki: rankiTags, marked };
}

const FLAG_COLOR_ORDER: AnkiFlagColors[] = [
  "none",
  "red",
  "orange",
  "green",
  "blue",
  "pink",
  "turquoise",
  "purple",
];

function buildHudConfig(
  config: RankiBaseConfig,
  collected: DataCollection,
  tags: FilteredTags,
): HudProps {
  const flagColorIndex = +collected.fields.flag.slice(
    -1,
  ) as AnkiFlagColorIndices;
  const flagColor = FLAG_COLOR_ORDER[flagColorIndex]! as AnkiFlagColors;
  return {
    order: config.hud.order,
    parser: {
      hasReplacements: true,
      parseMode: "v2",
      errorLevel: "none",
    },
    address: {
      prefix: [],
      exposed: collected.address,
      suffix: [],
    },
    tags: tags.neutral,
    review: {
      marked: tags.marked,
      flag: {
        type: collected.fields.flag,
        message: config.flags[flagColor].message,
      },
    },
    card: {
      type: collected.fields.type,
      card: collected.fields.card,
      face: collected.fields.face,
    },
  };
}
