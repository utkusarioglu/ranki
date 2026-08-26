import type {
  AnkiTemplateFields,
  CollectedConfig,
  CollectedConfigEntry,
  CollectedHtmlTagAttributes,
  CollectedWebviewType,
  HtmlAttrDir,
  HtmlAttrTheme,
  HtmlTagEnv,
  HtmlTagOs,
  RankiFaces,
  RawFields,
} from "./collect.types.mjs";

import { hasher } from "./hasher.mjs";
import {
  ALL_CONFIG_TYPES_SELECTOR,
  DATA_TYPE_CLASS_SELECTOR,
  INPUT_TYPE_CLASS_SELECTOR,
  O11Y_CLASS_SELECTOR,
} from "_/selector.constants.mjs";
import { assertNever } from "_error/assertions.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import { assertExists } from "@dqm/package-dqm-utils";

export class Collect {
  public static fields() {
    return collectRaw();
  }

  public static o11y() {
    const elem = document.querySelector(O11Y_CLASS_SELECTOR);
    if (!elem) return { type: "disabled" };
    const raw = elem.textContent;
    if (typeof raw === "string" && raw.toUpperCase() === "DEFAULT")
      return { type: "default" };
    try {
      const parsed = JSON.parse(raw);
      return {
        config: parsed,
        type: "custom",
      };
    } catch (e) {
      throw new RankiAppError({
        cause: e,
        code: "INVALID_TYPE",
        details: { raw },
        why: "observability input type needs to be valid json",
      });
    }
  }
}

function collectAnkiFields(): AnkiTemplateFields {
  const dataElems = document.querySelectorAll(DATA_TYPE_CLASS_SELECTOR);
  const fields = Object.fromEntries(
    Array.from(dataElems).map((data) => [getClassType(data), data.innerHTML]),
  ) as unknown as AnkiTemplateFields;
  return fields;
}

async function collectConfigFields(): Promise<CollectedConfig> {
  const configPromises: Promise<CollectedConfigEntry>[] = [];

  try {
    const configElems = document.querySelectorAll(ALL_CONFIG_TYPES_SELECTOR);
    for (const e of configElems) {
      const resourceType = getResourceType(e);
      switch (resourceType) {
        case "config":
          configPromises.push(
            Promise.resolve({
              config: e.innerHTML,
              name: getClassType(e),
            }),
          );
          break;
        case "config-file":
          {
            const src = e.getAttribute("href");
            try {
              assertExists(src, {
                why: "Src property is required for config file elements",
              });
              configPromises.push(
                (async () => ({
                  config: await fetch(src).then((t) => t.text()),
                  name: getClassType(e),
                }))(),
              );
            } catch (e) {
              throw new RankiAppError({
                cause: e,
                code: "CONFIG_FILE_RETRIEVAL",
                details: {
                  src,
                },
                why: "Fetch of the template config files have failed",
              });
            }
          }
          break;
        default:
          assertNever({
            details: { html: e.innerHTML, name: resourceType },
            why: "Unrecognized resource type",
          });
      }
    }
  } catch (e) {
    console.log(e);
  }

  const config: CollectedConfig = await Promise.all(configPromises);
  return config;
}

function collectFaces(): RankiFaces {
  const faces = Object.fromEntries(
    Array.from(document.querySelectorAll(INPUT_TYPE_CLASS_SELECTOR)).map(
      (e) => [getClassType(e), e],
    ),
  ) as RankiFaces;
  return faces;
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
    android: cls.has("android"),
    chrome: cls.has("chrome"),
    dataBsTheme,
    fancy: cls.has("fancy"),
    js: cls.has("js"),
    linux: cls.has("linux"),
    mobile: cls.has("mobile"),
    night_mode: cls.has("night_mode"),
    "night-mode": cls.has("night-mode"),
    nightMode: cls.has("nightMode"),
    title: titleElem.innerText,
    verticallyCentered: cls.has("vertically_centered"),
    windows: cls.has("isWin"),
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
    case "AnkiDroid":
      webview = "android::new";
      break;
    case "AnkiDroid Flashcard":
      webview = "android::old";
      break;
    case "main webview":
    case "previewer":
      webview = "windows";
      break;
    default:
      webview = "unknown";
  }

  return {
    dir,
    env,
    os,
    raw,
    scheme,
    webview,
  };
}

/**
 * @dev
 * #1 Basically the theater needs to be the last class name
 * #2 This is very fragile
 */
async function collectRaw(): Promise<RawFields> {
  const htmlAttr = collectHtmlTagAttributes();
  const fields = collectAnkiFields();
  const config = await collectConfigFields();
  const faces = collectFaces();
  const hash = hasher(htmlAttr, fields, config, faces);

  return {
    config,
    faces,
    fields,
    hash,
    htmlAttr,
  };
}

function getClassType(e: Element) {
  return e.className.split(" ").at(-1)!.trim(); // #1
}

function getResourceType(e: Element) {
  return e.className.split(" ")[0].replace("r2-", "").trim(); // #1
}
