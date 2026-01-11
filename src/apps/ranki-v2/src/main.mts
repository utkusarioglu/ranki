// import "core-js/es/array/from";
// import "core-js/es/map";
// import "core-js/es/map/iterator";

if (typeof Map !== "undefined") {
  // @ts-expect-error
  const orig = Map.prototype.values;
  // @ts-expect-error
  Map.prototype.values = function () {
    // @ts-expect-error
    const out = [];
    this.forEach((v) => out.push(v));
    // @ts-expect-error
    return out;
  };
}

import { AnkiUi } from "@ranki/package-anki-ui";
import { doDqm } from "./do-dqm.mts";
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
  const RANKI_TAG_INDICATOR = "+R2-";

  const tagsArr = data.tags
    .trim()
    .split(" ")
    .filter((v) => v.length);
  const rankiTags: string[] = [];
  const neutralTags: string[] = [];
  let marked = false;
  tagsArr.forEach((t) => {
    if (t.startsWith(RANKI_TAG_INDICATOR)) {
      rankiTags.push(t);
    } else if (t === "marked") {
      marked = true;
    } else {
      neutralTags.push(t);
    }
  });
  const address = data.deck.split("::");
  const hud = AnkiUi.cardHud({
    order: ["parser", "card", "address", "review", "tags"],
    parser: {
      hasReplacements: true,
      parseMode: "v2",
      errorLevel: "none",
    },
    address: {
      prefix: ["d"],
      exposed: address,
      suffix: [],
    },
    tags: neutralTags,
    review: {
      marked,
      flag: {
        type: "flag1",
        message: "Outdated",
      },
    },
    card: {
      type: data.type,
      face: data.face,
    },
  });
  // const hud = document.createElement("div");
  // hud.classList.add("hud");
  // hud.innerHTML = [data.deck, data.subdeck, data.type, data.card].join(" ");
  root.appendChild(hud.element);
  hud.css?.forEach((c) => {
    const e = document.createElement("style");
    e.id = c.id;
    e.innerHTML = c.css;
    root.appendChild(e);
  });
  // root.appendChild(hud.css)

  // @ts-expect-error
  const selectedFaces: string[] = FACE_ASSIGNMENTS[data.face];

  const inputs = selectedFaces.map((face) => {
    const selector = [INPUT_SELECTOR, face].join(".");
    const r = document.querySelector(selector)!;
    return { theater: face, dqm: r.innerHTML };
  });

  const content = document.createElement("div");
  content.classList.add("ranki-v2-content");
  const faceContainer = document.createElement("div");
  faceContainer.classList.add("ranki-v2-face-container");
  content.appendChild(faceContainer);
  root.appendChild(content);

  const faces = Object.fromEntries(
    selectedFaces.map((f) => {
      const container = document.createElement("div");
      container.classList.add("face");
      faceContainer.appendChild(container);
      return [f, container];
    }),
  );

  doDqm(inputs, faces, { scheme: "dark" });

  root.classList.add(RENDERED_SELECTOR);
}

onReady(main);
