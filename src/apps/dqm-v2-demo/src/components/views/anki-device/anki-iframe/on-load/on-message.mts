import { assertNotUndefined } from "_assertions";
import { RENDERED_CLASS_SELECTOR } from "@ranki/app-ranki-v2/constants";

import type { RankiFiles } from "../../screen/AnkiScreen.types.mts";
import type { OnMessageCallback } from "./on-message.types.mts";

import { createFragment } from "../../utils/create-fragment.mts";
import { MAPPING } from "../anki-iframe.constants.mts";
import { overrideWindowFetchFunc } from "./on-load.mts";
import type { RankiIframeMessageUpdate } from "_views/anki-device/utils/send.types.mjs";

export const onMessageCallback: OnMessageCallback =
  (win, doc, qa, files) =>
  ({ data }) => {
    {
      switch (data.type) {
        case "ranki-fetch":
          overrideWindowFetchFunc(win, data.fetchOverride);
          return;
        case "ranki-update":
          setTemplateHtml(qa, data, files);
          setFields(data, qa);
          setColorScheme(doc, data);
          ensureRerender(qa);
          return;
      }
    }
  };

function ensureRerender(qa: Element) {
  const ren = qa.querySelector(RENDERED_CLASS_SELECTOR);
  if (ren) ren.parentElement!.removeChild(ren);
}

function setColorScheme(doc: HTMLDocument, data: RankiIframeMessageUpdate) {
  const html = doc.querySelector("html")!;
  const body = doc.querySelector("body")!;

  const isDark = data.ranki.pref.scheme === "dark";
  if (!isDark) {
    body.classList.remove("night_mode", "nightMode", "night-mode");
    body.classList.add("light_mode", "lightMode", "light-mode");
    html.setAttribute("data-bs-theme", "light");
  } else {
    body.classList.add("night_mode", "nightMode", "night-mode");
    body.classList.remove("light_mode", "lightMode", "light-mode");
    html.setAttribute("data-bs-theme", "dark");
  }
}

function setFields(data: RankiIframeMessageUpdate, qa: Element) {
  Object.entries(data.ranki.fields).forEach(([n, v]) => {
    setField(qa, n, v as string);
  });
}

function setTemplateHtml(
  qa: Element,
  data: RankiIframeMessageUpdate,
  files: RankiFiles,
) {
  if (data.ranki.contentType === "foreign") {
    if (qa) {
      qa.innerHTML = "Foreign Content";
      return;
    }
  } else {
    const fragment = createFragment(files);
    qa.replaceChildren(fragment);
  }
}

const setField = (qa: Element, name: string, value: string) => {
  const selector = MAPPING[name];
  let f = qa.querySelector<HTMLScriptElement>(selector)!;
  if (!f) {
    const tag = selector.split(".")[0];
    f = document.createElement(tag) as HTMLScriptElement;
    f.className = selector.split(".")[1];
  }
  assertNotUndefined(f, { why: "Cannot find element" });
  f.innerText = value.toString();
};
