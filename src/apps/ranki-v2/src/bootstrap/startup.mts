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

export function shouldRender() {
  const qa = document.querySelector("#qa")!;
  let rendered = qa.querySelector("div.rendered");
  if (rendered) return false;
  rendered = document.createElement("div");
  rendered.className = "rendered";
  qa.appendChild(rendered);
  return true;
}
