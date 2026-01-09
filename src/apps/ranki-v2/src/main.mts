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

const DATA_SELECTOR = "data.ranki-v2-data";
const INPUT_SELECTOR = "data.ranki-v2-input";
const ROOT_SELECTOR = "#ranki-v2-root";
const RENDERED_SELECTOR = "ranki-rendered";

const FACE_ASSIGNMENTS = { A: ["A"], B: ["A", "B"] };

/**
 * @dev
 * #1 Basically the theater needs to be the last class name
 */
function main() {
  const root = document.querySelector<HTMLDivElement>(ROOT_SELECTOR);
  if (!root) {
    // REPLACE
    throw new Error("no root");
  }
  if (root.classList.contains(RENDERED_SELECTOR)) {
    return;
  }
  root.innerHTML = "";
  const dataElems = document.querySelectorAll(DATA_SELECTOR);
  const data = Object.fromEntries(
    Array.from(dataElems).map((data) => [
      data.className.split(" ").at(-1)!.trim(), // #1
      data.innerHTML,
    ]),
  );
  console.log("data", data);

  const hud = document.createElement("div");
  hud.classList.add("hud");
  hud.innerHTML = [data.deck, data.subdeck, data.type, data.card].join(" ");
  root.appendChild(hud);

  // @ts-expect-error
  const faces: string[] = FACE_ASSIGNMENTS[data.face];

  faces.forEach((f) => {
    const selector = [INPUT_SELECTOR, f].join(".");
    console.log("s", selector);
    const r = document.querySelector(selector)!;
    const container = document.createElement("div");
    container.classList.add("face");
    container.innerText = r.innerHTML;
    root.appendChild(container);
  });

  root.classList.add(RENDERED_SELECTOR);
}

onReady(main);
