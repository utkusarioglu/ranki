import { assertNotUndefined } from "_assertions";

import type { RankiFiles } from "../../AnkiScreen.types.mts";
import type { IFrameOnLoadCb } from "./on-load.types.mts";

import { createRankiElements } from "../../utils/create-ranki-elements.mts";
import { onMessageCallback } from "./on-message.mts";
import type { FetchOverrideRecord } from "_stores/anki-dist/anki.store.types.mjs";
import { onFetchCallback } from "_views/anki-screen/on-fetch/on-fetch.mjs";

let originalFetch: typeof window.fetch | null = null;
let originalWindow: Window | null = null;

export function overrideWindowFetchFunc(
  win: Window,
  fetchOverride: FetchOverrideRecord,
) {
  if (originalWindow !== win || originalFetch === null) {
    originalWindow = win;
    originalFetch = win.fetch;
  }
  win.fetch = onFetchCallback({ fetchOverride })(originalFetch);
}

export const iFrameOnLoad: IFrameOnLoadCb =
  ({ files, fetchOverride, onLoad, ref }) =>
  (e) => {
    ref.current = e.target as HTMLIFrameElement;

    const win = (e.target as HTMLIFrameElement).contentWindow;
    assertNotUndefined(win, { why: "iframe window object is needed" });
    const doc = ref.current?.contentDocument!;
    assertNotUndefined(doc, { why: "iframe document is needed" });

    setHtmlBaseTag(doc);
    attachFileSourcedTags(win, doc, files);
    overrideWindowFetchFunc(win, fetchOverride);

    onLoad();
  };

function attachFileSourcedTags(win: Window, doc: Document, files: RankiFiles) {
  const replaced = createRankiElements(files);
  const qa = doc.body.querySelector("#qa");
  assertNotUndefined(qa, { why: "#qa required for anki webview" });
  qa.replaceChildren(replaced.fragment);

  win.addEventListener("message", onMessageCallback(win, doc, qa, files));

  replaced.css.forEach((css) => {
    doc.body.appendChild(css);
  });
  replaced.jss.forEach((js) => {
    doc.body.appendChild(js);
  });
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
