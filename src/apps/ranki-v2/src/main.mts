import "./style.css";

function onReady(fn: any) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();

    const mut = new MutationObserver(fn);
    mut.observe(document.querySelector("body")!, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }
}

function main() {
  console.log("replace");
  const root = document.querySelector<HTMLDivElement>("#ranki-v2-root");
  if (!root) {
    throw new Error("no root");
  }
  if (root.classList.contains("ranki-rendered")) {
    return;
  }
  root.innerText = "This has been replaced";
  root.classList.add("ranki-rendered");
}

onReady(main);
