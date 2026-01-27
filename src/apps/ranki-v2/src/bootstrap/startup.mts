// ANKI
export function onReady(fn: any) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();

    const mut = new MutationObserver(fn);
    mut.observe(document.querySelector("#qa")!, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }
}

export function shouldRender() {
  const qa = document.querySelector("#qa")!;
  let r = qa.querySelector("div.rendered");
  if (r) {
    return false;
  }
  r = document.createElement("div");
  r.className = "rendered";
  qa.appendChild(r);
  return true;
}
