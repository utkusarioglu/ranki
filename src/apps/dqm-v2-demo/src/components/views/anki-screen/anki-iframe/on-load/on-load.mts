import { assertExists } from "_assertions";

import type { RankiFiles } from "../../AnkiScreen.types.mts";
import type { IFrameOnLoadCb } from "./on-load.types.mts";

import { createRankiElements } from "../../utils/create-ranki-elements.mts";
import { onMessageCallback } from "./on-message.mts";

export const FETCH_OVERRIDE = Symbol("fetcher");

export const iFrameOnLoad: IFrameOnLoadCb =
  ({ files, onFetch, onLoad, ref }) =>
  (e) => {
    ref.current = e.target as HTMLIFrameElement;

    const win = (e.target as HTMLIFrameElement).contentWindow;
    assertExists(win, { why: "iframe window object is needed" });
    const doc = ref.current?.contentDocument!;
    assertExists(doc, { why: "iframe document is needed" });

    setHtmlBaseTag(doc);
    attachFileSourcedTags(win, doc, files);
    overrideWindowFetchFunc(win, onFetch);

    onLoad();
  };

function attachFileSourcedTags(win: Window, doc: Document, files: RankiFiles) {
  const replaced = createRankiElements(files);
  const qa = doc.body.querySelector("#qa");
  assertExists(qa, { why: "#qa required for anki webview" });
  qa.replaceChildren(replaced.fragment);

  win.addEventListener("message", onMessageCallback(doc, qa, files));

  replaced.css.forEach((css) => {
    doc.body.appendChild(css);
  });
  replaced.jss.forEach((js) => {
    doc.body.appendChild(js);
  });
}

function overrideWindowFetchFunc(
  win: Window,
  onFetch:
    | ((originalFetch: typeof window.fetch) => typeof window.fetch)
    | undefined,
) {
  if (onFetch) {
    Object.defineProperty(onFetch, FETCH_OVERRIDE, { value: true });
    if (!Object.hasOwn(win.fetch, FETCH_OVERRIDE)) {
      win.fetch = onFetch(win.fetch);
    }
  }
}

function setHtmlBaseTag(doc: Document) {
  let base = doc.querySelector("base") as HTMLBaseElement;
  if (!base) {
    let head = doc.querySelector("head");
    if (!head) {
      head = document.createElement("head");
      doc.appendChild(head);
    }
    base = document.createElement("base");
    head.appendChild(base);
  }
  base.href = window.location.origin;
}
