import { assertExists } from "_error/assertions.mjs";

import type {
  CollectedHtmlTagAttributes,
  CollectedWebviewType,
  HtmlAttrDir,
  HtmlAttrTheme,
} from "./collect.types.mjs";

import { ENV_VARIANTS, OS_VARIANTS } from "./template.constants.mjs";

export class TagAttributes {
  public static collect(): CollectedHtmlTagAttributes {
    const htmlElem = document.querySelector("html");
    assertExists(htmlElem, { why: "Cannot collect data without html element" });
    const dir = htmlElem.getAttribute("dir") as HtmlAttrDir;
    const raw = this.raw(htmlElem);
    const os = OS_VARIANTS[[raw.android, raw.windows, raw.linux].indexOf(true)];
    const env = ENV_VARIANTS[[raw.chrome].indexOf(true)];
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
