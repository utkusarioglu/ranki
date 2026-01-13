import "./polyfills.mjs";
import "./style.css";
import { doDqm } from "./dqm/do-dqm.mts";
import { collectData } from "./collect/collect.mts";
import { createStructure } from "./components/card-content/card-content.mts";
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
    // #1
    if (root.classList.contains(RENDERED_SELECTOR)) {
      return;
    }
    root.classList.add(RENDERED_SELECTOR);
    root.innerHTML = "";

    try {
      const collected = collectData();
      const { faces } = createStructure(collected, root);
      doDqm(collected.inputs, faces, [DQM_BASE_CONFIG], { scheme: "dark" });
    } catch (e) {
      const error = createGeneralError(e);
      root.appendChild(error.element);
    }
  } catch (e) {
    const error = createGeneralError(e);
    document.body.innerText = "";
    document.body.appendChild(error.element);
  }
}

onReady(main);
