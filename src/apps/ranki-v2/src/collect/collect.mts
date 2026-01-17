import type {
  AnkiDeckParts,
  AnkiTemplateFields,
  CollectedConfig,
  CollectedHtmlTagAttributes,
  DataCollection,
  HtmlAttrDir,
  HtmlAttrTheme,
  HtmlTagClassCollection,
  RankiFaces,
} from "./collect.types.mjs";
import {
  CONFIG_FILE_CLASS_SELECTOR,
  CONFIG_TYPE_CLASS_SELECTOR,
  DATA_TYPE_CLASS_SELECTOR,
  INPUT_TYPE_CLASS_SELECTOR,
} from "../selector.constants.mjs";
import { assertExists } from "@dqm/package-dqm-utils";
import { RankiAppError } from "../error/ranki-app-error.mts";
import { hash } from "./hash.mts";

function getClassType(e: Element) {
  return e.className.split(" ").at(-1)!.trim(); // #1
}

async function getConfig(): Promise<CollectedConfig> {
  let config = {} as CollectedConfig;
  try {
    const configElems = document.querySelectorAll(CONFIG_TYPE_CLASS_SELECTOR);
    config = Object.fromEntries(
      Array.from(configElems).map((data) => [
        getClassType(data),
        data.innerHTML,
        // yaml.parse(data.innerHTML),
      ]),
    ) as CollectedConfig;
  } catch (e) {
    console.log(e);
  }
  try {
    const configFiles = document.querySelectorAll(CONFIG_FILE_CLASS_SELECTOR);
    const configFromFiles = await Promise.all(
      Array.from(configFiles).map(async (e) => {
        const src = e.getAttribute("src");
        assertExists(src, {
          why: "Src property is required for config file elements",
        });
        try {
          const obj = await fetch(src).then((t) => t.text());
          // .then((j) => yaml.parse(j));
          return [getClassType(e), obj];
        } catch (e) {
          throw new RankiAppError({
            code: "MISSING_CONFIG",
            why: "Fetch of the template config files have failed",
            cause: e,
            details: {
              src,
            },
          });
        }
      }),
    );
    config = { ...config, ...Object.fromEntries(configFromFiles) };
  } catch (e) {
    throw new RankiAppError({
      code: "FAILED_USER_CONFIG_RETRIEVAL",
      why: "User config retrieval failed",
      cause: e,
    });
  }
  return config;
}

function getFields(): AnkiTemplateFields {
  const dataElems = document.querySelectorAll(DATA_TYPE_CLASS_SELECTOR);
  const fields = Object.fromEntries(
    Array.from(dataElems).map((data) => [
      getClassType(data),
      // data.className.split(" ").at(-1)!.trim(), // #1
      data.innerHTML,
    ]),
  ) as unknown as AnkiTemplateFields;
  return fields;
}

function getHtmlTagAttributes(): CollectedHtmlTagAttributes {
  const htmlElem = document.querySelector("html");
  assertExists(htmlElem, { why: "Cannot collect data without html element" });
  // #2
  const [mode, os, env] = htmlElem.className.split(
    " ",
  ) as HtmlTagClassCollection;
  const dir = htmlElem.getAttribute("dir") as HtmlAttrDir;
  const dataBsTheme = htmlElem.getAttribute("data-bs-theme") as HtmlAttrTheme;
  return { mode, os, env, dir, dataBsTheme };
}

function getFaces(): RankiFaces {
  // const faces: RankiFaces = {};
  const faces = Object.fromEntries(
    Array.from(document.querySelectorAll(INPUT_TYPE_CLASS_SELECTOR)).map(
      (e) => [getClassType(e), e],
    ),
  ) as RankiFaces;
  return faces;
}

/**
 * @dev
 * #1 Basically the theater needs to be the last class name
 * #2 This is very fragile
 */
export async function collectData(): Promise<DataCollection> {
  const htmlAttr = getHtmlTagAttributes();
  const fields = getFields();
  const config = await getConfig();
  const faces = getFaces();

  const address = fields.deck.split("::") as AnkiDeckParts;

  return {
    hash: hash(JSON.stringify([htmlAttr, fields, config, faces, address])),
    // raw: {
    htmlAttr,
    fields,
    address,
    faces,
    // tags
    // marked,
    // },
    // hud,
    // pref: { scheme: "dark" },
    // inputs,
    // theaterOrder,
    // neutralTags,
    // rankiTags,
    config,
  };
}
