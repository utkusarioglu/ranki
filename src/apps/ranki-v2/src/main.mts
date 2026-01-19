import "./utils/polyfills.mjs";
import "./style/vendor-anki.css";
import "./style/schemes.css";
import "./style/palettes.css";
import "./style/variables.css";
import "./style/theme.css";
import "./style/vendor-dqm.css";
import "./style/ranki-v2-root.css";
import { renderDqm } from "./dqm/render-dqm.mjs";
import { collectData } from "./collect/collect.mjs";
import { createApp } from "./components/app/app.mjs";
import { createAppErrorScreen } from "./components/general-error/general-error.mjs";
import { RankiAppError } from "./error/ranki-app-error.mjs";
import { onReady } from "./utils/onReady.mjs";
import { createConfigs } from "./config/config.mts";
import { createDesign } from "./theme/theme.mts";

const ROOT_ID_SELECTOR = "#ranki-v2-root";
const RENDERED_CLASS_SELECTOR = "ranki-rendered";

/**
 * @dev
 * #1 DECIDE THis is below data collection because there may be a hash involved
 * in determining whether to render a certain face
 */
async function main() {
  try {
    const root = document.querySelector<HTMLDivElement>(ROOT_ID_SELECTOR);
    if (!root) {
      throw new RankiAppError({
        code: "NO_ROOT",
        why: "Cannot render the application without a root in the template",
        cause: null,
      });
    }
    // #1
    if (root.classList.contains(RENDERED_CLASS_SELECTOR)) {
      return;
    }
    root.classList.add(RENDERED_CLASS_SELECTOR);
    root.innerHTML = "";

    // try {
    const collected = await collectData();
    const config = createConfigs(collected);
    createDesign(document, config.ranki);
    const { roots } = createApp(config.ranki, root);
    // @ts-expect-error
    const report =
      //
      await renderDqm(config.dqm, roots);
    // } catch (e) {
    //   createAppErrorScreen(root, e);
    // }
  } catch (e) {
    createAppErrorScreen(document.body, e);
  }
}

onReady(main);
