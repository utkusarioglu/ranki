import "./polyfills.mjs";
import { doDqm } from "./dqm/do-dqm.mts";
import "./style.css";
import { cardHud } from "./components/card-hud/main.mts";
import { collectData } from "./collect/collect.mts";
import { cardContent } from "./components/card-content/card-content.mts";
import { createGeneralError } from "./components/general-error/general-error.mts";
import { RankiAppError } from "./error.mts";
import { DQM_BASE_CONFIG } from "./dqm/constants.mts";

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

const ROOT_SELECTOR = "#ranki-v2-root";
const RENDERED_SELECTOR = "ranki-rendered";

/**
 * @dev
 * #1 DECIDE THis is below data collection because there may be a hash involved
 * in determining whether to render a certain face
 */
function main() {
  try {
    const root = document.querySelector<HTMLDivElement>(ROOT_SELECTOR);
    if (!root) {
      throw new RankiAppError({
        code: "NO_ROOT",
        why: "Cannot render the application without a root in the template",
        cause: null,
      });
    }
    const { data, inputs, selectedFaces, address, neutralTags, marked } =
      collectData();
    // #1
    if (root.classList.contains(RENDERED_SELECTOR)) {
      return;
    }
    root.innerHTML = "";

    const hud = cardHud({
      order: ["parser", "card", "address", "review", "tags"],
      parser: {
        hasReplacements: true,
        parseMode: "v2",
        errorLevel: "none",
      },
      address: {
        prefix: [],
        exposed: address,
        suffix: [],
      },
      tags: neutralTags,
      review: {
        marked,
        flag: {
          type: data.flag,
          message: "Some message",
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

    const { faces } = cardContent(root, selectedFaces);
    // root.appendChild(hud.css)

    doDqm(inputs, faces, [DQM_BASE_CONFIG], { scheme: "dark" });

    root.classList.add(RENDERED_SELECTOR);
  } catch (e) {
    createGeneralError(document.body, e);
  }
}

onReady(main);
