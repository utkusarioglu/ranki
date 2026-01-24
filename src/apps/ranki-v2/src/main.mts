import "./utils/polyfills.mjs";
import "./style/vendor-anki.css";
import "./style/schemes.css";
import "./style/palettes.css";
import "./style/variables.css";
import "./style/theme.css";
import "./style/vendor-dqm.css";
import "./style/vendor-all.css";
import "./style/ranki-v2-root.css";
import { renderDqm } from "./dqm/render-dqm.mjs";
import { createApp } from "./components/app/app.mjs";
import { RankiAppError } from "./error/ranki-app-error.mjs";
import { onReady } from "./utils/onReady.mjs";
import { createConfig } from "./config/config.mts";
import { createDesign } from "./theme/theme.mts";
import { createIndicators } from "./components/indicator/indicator.mts";
import {
  RENDERED_CLASS_SELECTOR,
  ROOT_ID_SELECTOR,
} from "./selector.constants.mts";
import { hud, hudDefine } from "./components/hud/hud.mts";
import { hudAddressDefine } from "./components/hud/features/address/address.mts";
import { devMethods } from "./dev.mts";
import { hudAddressCrumbDefine } from "./components/hud/features/address/HudAddressCrumb.mts";
import { hudCardDefine } from "./components/hud/features/card/card.mts";
import { hudCuesDefine } from "./components/hud/features/cues/cues.mts";
import { hudCuesCueDefine } from "./components/hud/features/cues/hud-cue.mts";
import { hudTagsTagDefine } from "./components/hud/features/tags/HudTagsTag.mts";
import { hudTagsDefine } from "./components/hud/features/tags/tags.mts";

devMethods();
hudAddressDefine();
hudDefine();
hudAddressCrumbDefine();
hudCardDefine();
hudCuesCueDefine();
hudCuesDefine();
hudTagsTagDefine();
hudTagsDefine();

/**
 * @dev
 * #1 DECIDE THis is below data collection because there may be a hash involved
 * in determining whether to render a certain face
 */
async function main() {
  try {
    console.log("RUN");
    const root = document.querySelector<HTMLDivElement>("#" + ROOT_ID_SELECTOR);
    if (!root) {
      console.log("throwing now");
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

    const config = await createConfig();
    console.log(config.ranki.hud);
    hud(config.ranki.hud, document.body);
    document.body.classList.add("content-grid");

    createDesign(document, config.ranki);
    createIndicators(root, config.ranki);
    const { roots } = createApp(config.ranki, root);
    // @ts-expect-error
    const report =
      //
      await renderDqm(config.dqm, roots);
  } catch (e) {
    const { createAppErrorScreen } =
      await import("./components/general-error/general-error.mjs");
    createAppErrorScreen(document.body, e);
  }
}

onReady(main);
