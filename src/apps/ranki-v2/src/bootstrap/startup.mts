import { RENDERED_CLASS_SELECTOR } from "_/selector.constants.mjs";

// ANKI
export function onReady(fn: any) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();

    const observer = new MutationObserver(fn);
    observer.observe(document.querySelector("#qa")!, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }
}

export function shouldRender(): "render" | "remove" | "stop" {
  const qa = document.querySelector("#qa")!;
  let rendered = qa.querySelector(RENDERED_CLASS_SELECTOR);
  if (rendered) return "stop";
  const r2Elems = qa.querySelectorAll('[class^="r2-"]');
  const r2Eligible = r2Elems.length > 0;
  if (!r2Eligible) return "remove";
  rendered = document.createElement("div");
  rendered.className = RENDERED_CLASS_SELECTOR.split(".")[1];
  qa.appendChild(rendered);
  return "render";
}
