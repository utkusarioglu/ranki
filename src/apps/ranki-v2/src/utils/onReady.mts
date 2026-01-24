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
