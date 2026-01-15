import yaml from "yaml";
import type {
  AnkiDeckParts,
  AnkiMarked,
  AnkiNeutralTags,
  AnkiRawTag,
  AnkiTemplateFields,
  CardFaceArray,
  DataCollection,
  HtmlAttrDir,
  HtmlAttrTheme,
  HtmlTagClassCollection,
  RankiTag,
  RankiTags,
} from "./collect.types.mjs";
import {
  CONFIG_TYPE_CLASS_SELECTOR,
  DATA_TYPE_CLASS_SELECTOR,
  INPUT_TYPE_CLASS_SELECTOR,
  RANKI_TAG_INDICATOR,
} from "../selector.constants.mjs";
import { assertArrayNotEmpty, assertExists } from "@dqm/package-dqm-utils";
import { RankiAppError } from "../error/ranki-app-error.mts";

const FACE_ASSIGNMENTS = { Q: ["A"], N: ["A", "B"] };

/**
 * @dev
 * #1 Basically the theater needs to be the last class name
 * #2 This is very fragile
 */
export function collectData(): DataCollection {
  const htmlElem = document.querySelector("html");
  assertExists(htmlElem, { why: "Cannot collect data without html element" });
  // #2
  const [mode, os, env] = htmlElem.className.split(
    " ",
  ) as HtmlTagClassCollection;
  const dir = htmlElem.getAttribute("dir") as HtmlAttrDir;
  const dataBsTheme = htmlElem.getAttribute("data-bs-theme") as HtmlAttrTheme;

  const dataElems = document.querySelectorAll(DATA_TYPE_CLASS_SELECTOR);
  // @ts-expect-error
  const fields: AnkiTemplateFields = Object.fromEntries(
    Array.from(dataElems).map((data) => [
      data.className.split(" ").at(-1)!.trim(), // #1
      data.innerHTML,
    ]),
  );

  // @ts-expect-error
  let config = {};
  try {
    const configElems = document.querySelectorAll(CONFIG_TYPE_CLASS_SELECTOR);
    config = Object.fromEntries(
      Array.from(configElems).map((data) => [
        data.className.split(" ").at(-1)!.trim(), // #1
        yaml.parse(data.innerHTML),
      ]),
    );
  } catch (e) {
    console.log(e);
  }

  // @ts-expect-error
  const theaterOrder: undefined | string[] = FACE_ASSIGNMENTS[fields.face];
  assertExists(theaterOrder, {
    why: "Cannot process without a valid face assignment",
    details: { FACE_ASSIGNMENTS, face: fields.face },
  });
  assertArrayNotEmpty(theaterOrder, {
    why: "Given theater order has to be a non-empty array",
    details: { FACE_ASSIGNMENTS, face: fields.face },
  });

  // // @ts-expect-error
  // const theaterOrder: CardFaceArray = FACE_ASSIGNMENTS[fields.face];

  const inputs = theaterOrder.map((face) => {
    const selector = [INPUT_TYPE_CLASS_SELECTOR, face].join(".");
    const r = document.querySelector(selector)!;
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

  const address = fields.deck.split("::") as AnkiDeckParts;

  const tagsArr = fields.tags
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

  return {
    raw: {
      html: {
        os,
        env,
        mode,
        dir,
        dataBsTheme,
      },
      fields,
    },
    hud: {
      order: ["parser", "card", "address", "review", "tags"],
      parser: {
        hasReplacements: true,
        parseMode: "v2",
        errorLevel: "none",
      },
      address: {
        prefix: [],
        exposed: address,
        suffix: [],
      },
      tags: neutralTags,
      review: {
        marked,
        flag: {
          type: fields.flag,
          message: "Some message",
        },
      },
      card: {
        type: fields.type,
        face: fields.face,
      },
    },
    pref: { scheme: "dark" },
    inputs,
    theaterOrder,
    address,
    marked,
    neutralTags,
    rankiTags,
  };
}
