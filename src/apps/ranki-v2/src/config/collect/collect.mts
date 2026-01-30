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
  CollectedConfigEntry,
} from "./collect.types.mjs";
import {
  ALL_CONFIG_TYPES_SELECTOR,
  DATA_TYPE_CLASS_SELECTOR,
  INPUT_TYPE_CLASS_SELECTOR,
} from "_/selector.constants.mjs";
import { assertExists } from "@dqm/package-dqm-utils";
import { hasher } from "./hasher.mts";
import { assertNever } from "_error/assertions.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";

function getClassType(e: Element) {
  return e.className.split(" ").at(-1)!.trim(); // #1
}

function getResourceType(e: Element) {
  return e.className.split(" ")[0].replace("r2-", "").trim(); // #1
}

async function collectConfigFields(): Promise<CollectedConfig> {
  let configPromises: Promise<CollectedConfigEntry>[] = [];

  try {
    const configElems = document.querySelectorAll(ALL_CONFIG_TYPES_SELECTOR);
    for (let e of configElems) {
      const resourceType = getResourceType(e);
      switch (resourceType) {
        case "config":
          configPromises.push(
            Promise.resolve({
              name: getClassType(e),
              config: e.innerHTML,
            }),
          );
          break;
        case "config-file":
          const src = e.getAttribute("href");
          try {
            assertExists(src, {
              why: "Src property is required for config file elements",
            });
            configPromises.push(
              (async () => ({
                name: getClassType(e),
                config: await fetch(src).then((t) => t.text()),
              }))(),
            );
          } catch (e) {
            throw new RankiAppError({
              code: "CONFIG_FILE_RETRIEVAL",
              why: "Fetch of the template config files have failed",
              cause: e,
              details: {
                src,
              },
            });
          }
          break;
        default:
          assertNever({
            why: "Unrecognized resource type",
            details: { name: resourceType, html: e.innerHTML },
          });
      }
    }
  } catch (e) {
    console.log(e);
  }

  const config: CollectedConfig = await Promise.all(configPromises);
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

  return {
    hash,
    htmlAttr,
    fields,
    faces,
    config,
  };
}
