import type {
  AnkiTemplateFields,
  CollectedConfig,
  CollectedHtmlTagAttributes,
  RawFields,
  HtmlAttrDir,
  HtmlAttrTheme,
  RankiFaces,
  HtmlTagOs,
  HtmlTagEnv,
  CollectedWebviewType,
} from "./collect.types.mjs";
import {
  CONFIG_FILE_CLASS_SELECTOR,
  CONFIG_TYPE_CLASS_SELECTOR,
  DATA_TYPE_CLASS_SELECTOR,
  INPUT_TYPE_CLASS_SELECTOR,
} from "../../selector.constants.mjs";
import { assertExists } from "@dqm/package-dqm-utils";
import { RankiAppError } from "../../error/ranki-app-error.mts";
import { hasher } from "./hasher.mts";

function getClassType(e: Element) {
  return e.className.split(" ").at(-1)!.trim(); // #1
}

async function collectConfigFields(): Promise<CollectedConfig> {
  let config = {} as CollectedConfig;
  try {
    const configElems = document.querySelectorAll(CONFIG_TYPE_CLASS_SELECTOR);
    config = Object.fromEntries(
      Array.from(configElems).map((data) => [
        getClassType(data),
        data.innerHTML,
      ]),
    ) as CollectedConfig;
  } catch (e) {
    console.log(e);
  }
  try {
    const configFiles = document.querySelectorAll(CONFIG_FILE_CLASS_SELECTOR);
    const configFromFiles = await Promise.all(
      Array.from(configFiles).map(async (e) => {
        const src = e.getAttribute("href");
        assertExists(src, {
          why: "Src property is required for config file elements",
        });
        try {
          const obj = await fetch(src).then((t) => t.text());
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

function collectAnkiFields(): AnkiTemplateFields {
  const dataElems = document.querySelectorAll(DATA_TYPE_CLASS_SELECTOR);
  const fields = Object.fromEntries(
    Array.from(dataElems).map((data) => [getClassType(data), data.innerHTML]),
  ) as unknown as AnkiTemplateFields;
  return fields;
}

function collectHtmlTagAttributes(): CollectedHtmlTagAttributes {
  const htmlElem = document.querySelector("html");
  assertExists(htmlElem, { why: "Cannot collect data without html element" });
  const bodyElem = document.body;
  const titleElem = document.querySelector("title");
  assertExists(titleElem, { why: "Cannot collect data without title element" });
  // #2
  const htmlClasses = htmlElem.className.split(" ");
  const bodyClasses = bodyElem.className.split(" ");
  const cls = new Set([...htmlClasses, ...bodyClasses]);

  const dir = htmlElem.getAttribute("dir") as HtmlAttrDir;
  const dataBsTheme = htmlElem.getAttribute("data-bs-theme") as HtmlAttrTheme;

  const raw = {
    mobile: cls.has("mobile"),
    linux: cls.has("linux"),
    android: cls.has("android"),
    chrome: cls.has("chrome"),
    windows: cls.has("isWin"),
    js: cls.has("js"),
    fancy: cls.has("fancy"),
    dataBsTheme,
    verticallyCentered: cls.has("vertically_centered"),
    night_mode: cls.has("night_mode"),
    nightMode: cls.has("nightMode"),
    "night-mode": cls.has("night-mode"),
    title: titleElem.innerText,
  };

  const OS: HtmlTagOs[] = ["android", "windows", "linux"];
  const os = OS[[raw.android, raw.windows, raw.linux].indexOf(true)];
  const ENV: HtmlTagEnv[] = ["chrome"];
  const env = ENV[[raw.chrome].indexOf(true)];
  const scheme: HtmlAttrTheme =
    [
      dataBsTheme === "dark",
      raw.night_mode,
      raw.nightMode,
      raw["night-mode"],
    ].indexOf(true) !== -1
      ? "dark"
      : "light";

  let webview: CollectedWebviewType;
  switch (raw.title) {
    case "AnkiDroid Flashcard":
      webview = "android-old";
      break;
    case "AnkiDroid":
      webview = "android-new";
      break;
    case "previewer":
    case "main webview":
      webview = "windows";
      break;
    default:
      webview = "unknown";
  }

  return {
    raw,
    webview,
    os,
    env,
    dir,
    scheme,
  };
}

function collectFaces(): RankiFaces {
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
export async function collectRaw(): Promise<RawFields> {
  const htmlAttr = collectHtmlTagAttributes();
  const fields = collectAnkiFields();
  const config = await collectConfigFields();
  const faces = collectFaces();
  const hash = hasher(htmlAttr, fields, config, faces);

  console.log("h", htmlAttr);

  return {
    hash,
    htmlAttr,
    fields,
    faces,
    config,
  };
}
