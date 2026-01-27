import "./bootstrap/polyfills.mjs";
import { onReady, shouldRender } from "./bootstrap/startup.mjs";
import { createConfig } from "./config/config.mts";
import { createDesign } from "./theme/theme.mts";
import { RankiHud } from "./components/hud/hud.mts";
import { devMethods } from "./dev.mts";
import { setStyles } from "./style/style.mts";
import { RankiFaces } from "./components/faces/faces.mts";
import { RankiIndicator } from "./components/indicator/indicator.mts";

devMethods();

/**
 * @dev
 * #1 DECIDE THis is below data collection because there may be a hash involved
 * in determining whether to render a certain face
 */
async function main() {
  try {
    if (!shouldRender()) {
      return;
    }

    setStyles();
    const config = await createConfig();
    RankiHud.singleton(config.ranki.hud, document.body);

    createDesign(config.ranki);
    RankiIndicator.singleton(config.ranki, document.body);
    RankiFaces.singleton(
      { faces: config.ranki.order, dqm: config.dqm },
      document.body,
    );
  } catch (e) {
    const { createAppErrorScreen } =
      await import("./components/general-error/general-error.mjs");
    createAppErrorScreen(document.body, e);
  }
}

onReady(main);
