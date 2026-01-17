import yaml from "yaml";
import { Config } from "@dqm/package-dqm-utils";
import { FLAG_COLOR_ORDER, RANKI_INITIAL_CONFIG } from "./config.constants.mts";
import type { RankiConfig } from "../export.types.mts";
import type {
  DqmParseInputStructured,
  DqmParseTheater,
} from "@dqm/package-dqm-v2";
import type {
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
import type {
  Conf,
  RankiDqmConfig,
  RankiGlobalConfig,
} from "./config.types.mts";
import type { HudProps } from "../components/hud/hud.types.mts";
import type {
  AnkiFlagColorIndices,
  AnkiFlagColors,
  RankiBaseConfig,
  RankiGlobalConfigPartial,
} from "./config.types.mts";
import { checkMatch } from "./determine.mts";

function buildBaseConfig(
  globalConfig: RankiGlobalConfig,
  tags: FilteredTags,
  raw: DataCollection,
) {
  const appConfig = new Config("app");
  appConfig.pushConfig("default", globalConfig.base);
  [
    {
      name: "deck",
      curr: raw.fields.deck,
      matchers: globalConfig.decks,
    },
    {
      name: "card",
      curr: raw.fields.card,
      matchers: globalConfig.cards,
    },
    {
      name: "type",
      curr: raw.fields.type,
      matchers: globalConfig.types,
    },
    {
      name: "face",
      curr: raw.fields.face,
      matchers: globalConfig.faces,
    },
  ].forEach(({ name, curr, matchers }) => {
    const conf = checkMatch(curr, matchers);
    if (conf) {
      appConfig.pushConfig(name, conf.config);
    }
  });

  tags.neutral.forEach((t) => {
    const conf = checkMatch(t, globalConfig.tags);
    if (conf) {
      appConfig.pushConfig(`tag:neutral:${t}`, conf.config);
    }
  });

  tags.ranki.forEach((t) => {
    const conf = checkMatch(t, globalConfig.tags);
    if (conf) {
      appConfig.pushConfig(`tag:ranki:${t}`, conf.config);
    }
  });

  if (tags.marked) {
    const marked = globalConfig.tags.find((v) => v.exact === "marked");
    if (marked) {
      appConfig.pushConfig("tag:marked", marked.config);
    }
  }

  const config = appConfig
    .mergeTo("merged")
    .getConfig<RankiBaseConfig>("merged");
  return config;
}

export function createConfigs(raw: DataCollection): Conf {
  const globalConfig = buildGlobalConfig(raw);
  const tags = filterTags(raw);
  const config = buildBaseConfig(globalConfig, tags, raw);

  const order = getFaceOrder(config, raw);

  const hud = buildHudConfig(config, raw, tags);

  return {
    ranki: {
      hud,
      order,
    },
    dqm: buildDqmConfig(raw, order, config),
  };
}

/**
 * @dev
 * #1 DECIDE For some reason anki has two different attributes for theme. one in
 * className of html and the other is data-bs-theme again in html. I'm not sure
 * which one is the correct one to use.
 */
function buildDqmConfig(
  raw: DataCollection,
  order: CardFaceArray,
  config: RankiBaseConfig,
): RankiDqmConfig {
  const inputs = getInputs(
    raw,
    order.filter((v) => !v.startsWith("ranki")),
  );
  const scheme =
    config.design.scheme === "system"
      ? raw.htmlAttr.dataBsTheme // #1
      : config.design.scheme;

  return {
    inputs,
    pref: { scheme },
    config: config.dqm,
  };
}

function getFaceOrder(
  config: RankiBaseConfig,
  collected: DataCollection,
): CardFaceArray {
  const order: undefined | CardFaceArray = config.faces[collected.fields.face];
  assertExists(order, {
    why: "Cannot process without a valid face assignment",
    details: { faces: config.faces, face: collected.fields.face },
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

  return gConfig.mergeTo("merged").getConfig<RankiConfig>("merged");
}

function getInputs(
  collected: DataCollection,
  theaterOrder: DqmParseTheater[],
): DqmParseInputStructured {
  assertArrayNotEmpty(theaterOrder, {
    why: "Given theater order has to be a non-empty array",
    details: { order: theaterOrder, face: collected.fields.face },
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
  const ranki = [] as RankiTags;
  const neutral = [] as AnkiNeutralTags;
  let marked = false as AnkiMarked;
  tagsArr.forEach((t) => {
    if (t.startsWith(RANKI_TAG_INDICATOR)) {
      ranki.push(t as RankiTag);
    } else if (t === "marked") {
      marked = true as AnkiMarked;
    } else {
      neutral.push(t as AnkiRawTag);
    }
  });
  return { neutral, ranki, marked };
}

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
    visibility: config.hud.visibility,
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
      count: tags.neutral.length + tags.ranki.length,
      neutral: tags.neutral,
      ranki: tags.ranki,
    },
    // TODO maybe you need tag messages here
    review: {
      marked: tags.marked && config.marked,
      flag: {
        type: collected.fields.flag,
        color: flagColor,
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
