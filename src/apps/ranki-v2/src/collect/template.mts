import {
  ALL_CONFIG_TYPES_SELECTOR,
  DATA_TYPE_CLASS_SELECTOR,
  INPUT_TYPE_CLASS_SELECTOR,
} from "_/selector.constants.mjs";
import { assertNever } from "_error/assertions.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";

import type {
  AnkiTemplateFields,
  CollectedConfig,
  CollectedConfigEntry,
  CollectedHtmlTagAttributes,
  CollectedWebviewType,
  HtmlAttrDir,
  HtmlAttrTheme,
  RankiFaces,
  RawFields,
} from "./collect.types.mjs";

import { assertExists } from "../../../../packages/dqm-utils/src/assertions.mjs";
import { hasher } from "./hasher.mjs";
import { ENV, OS } from "./template.constants.mjs";

export class CollectTemplate {
  /**
   * @dev
   * #1 Basically the theater needs to be the last class name
   * #2 This is very fragile
   */
  public static async all(): Promise<RawFields> {
    const htmlAttr = this.htmlTagAttributes();
    const fields = this.collectAnkiFields();
    const config = await this.collectConfigFields();
    const faces = this.faces();
    const hash = hasher(htmlAttr, fields, config, faces);

    return {
      config,
      faces,
      fields,
      hash,
      htmlAttr,
    };
  }

  private static collectAnkiFields(): AnkiTemplateFields {
    const dataElems = document.querySelectorAll(DATA_TYPE_CLASS_SELECTOR);
    return Object.fromEntries(
      Array.from(dataElems).map((data) => [
        this.getClassType(data),
        data.innerHTML,
      ]),
    ) as unknown as AnkiTemplateFields;
  }

  private static async collectConfigFields(): Promise<CollectedConfig> {
    const configPromises: Promise<CollectedConfigEntry>[] = [];
    try {
      const configElems = document.querySelectorAll(ALL_CONFIG_TYPES_SELECTOR);
      for (const e of configElems) {
        configPromises.push(this.configField(e));
      }
      const config: CollectedConfig = await Promise.all(configPromises);
      return config;
    } catch (e) {
      throw new RankiAppError({
        cause: e,
        code: "CONFIG_RETRIEVAL",
        why: "Fetch of the template config files have failed",
      });
    }
  }

  private static configField(e: Element) {
    const resourceType = this.getResourceType(e);
    switch (resourceType) {
      case "config":
        return Promise.resolve({
          config: e.innerHTML,
          name: this.getClassType(e),
        });
      case "config-file":
        return this.configFile(e);
      default:
        assertNever({
          details: { html: e.innerHTML, name: resourceType },
          why: "Unrecognized resource type",
        });
    }
  }

  private static async configFile(e: Element) {
    const src = e.getAttribute("href");
    try {
      assertExists(src, {
        why: "Src property is required for config file elements",
      });
      return (async () => ({
        config: await fetch(src).then((t) => t.text()),
        name: this.getClassType(e),
      }))();
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

  private static faces(): RankiFaces {
    const faces = Object.fromEntries(
      Array.from(document.querySelectorAll(INPUT_TYPE_CLASS_SELECTOR)).map(
        (e) => [this.getClassType(e), e],
      ),
    ) as RankiFaces;
    return faces;
  }

  private static getClassType(e: Element) {
    return e.className.split(" ").at(-1)!.trim(); // #1
  }

  private static getResourceType(e: Element) {
    return e.className.split(" ")[0].replace("r2-", "").trim(); // #1
  }

  private static htmlTagAttributes(): CollectedHtmlTagAttributes {
    const htmlElem = document.querySelector("html");
    assertExists(htmlElem, { why: "Cannot collect data without html element" });
    const dir = htmlElem.getAttribute("dir") as HtmlAttrDir;
    const raw = this.raw(htmlElem);
    const os = OS[[raw.android, raw.windows, raw.linux].indexOf(true)];
    const env = ENV[[raw.chrome].indexOf(true)];
    const scheme = this.scheme(htmlElem, raw);
    const webview = this.webview(raw);

    return {
      dir,
      env,
      os,
      raw,
      scheme,
      webview,
    };
  }

  private static raw(
    htmlElem: HTMLHtmlElement,
  ): CollectedHtmlTagAttributes["raw"] {
    const titleElem = document.querySelector("title");
    assertExists(titleElem, {
      why: "Cannot collect data without title element",
    });
    const bodyElem = document.body;
    const htmlClasses = htmlElem.className.split(" ");
    const bodyClasses = bodyElem.className.split(" ");
    const merged = new Set([...htmlClasses, ...bodyClasses]);
    const raw = {
      android: merged.has("android"),
      chrome: merged.has("chrome"),
      fancy: merged.has("fancy"),
      js: merged.has("js"),
      linux: merged.has("linux"),
      mobile: merged.has("mobile"),
      night_mode: merged.has("night_mode"),
      "night-mode": merged.has("night-mode"),
      nightMode: merged.has("nightMode"),
      title: titleElem.innerText,
      verticallyCentered: merged.has("vertically_centered"),
      windows: merged.has("isWin"),
    };
    return raw;
  }

  private static scheme(
    htmlElem: HTMLHtmlElement,
    raw: CollectedHtmlTagAttributes["raw"],
  ) {
    const dataBsTheme = htmlElem.getAttribute("data-bs-theme") as HtmlAttrTheme;
    const scheme: HtmlAttrTheme =
      [
        dataBsTheme === "dark",
        raw.night_mode,
        raw.nightMode,
        raw["night-mode"],
      ].indexOf(true) !== -1
        ? "dark"
        : "light";
    return scheme;
  }

  private static webview(
    raw: CollectedHtmlTagAttributes["raw"],
  ): CollectedWebviewType {
    switch (raw.title) {
      case "AnkiDroid":
        return "android::new";
      case "AnkiDroid Flashcard":
        return "android::old";
      case "main webview":
      case "previewer":
        return "windows";
      default:
        return "unknown";
    }
  }
}
