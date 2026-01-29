import "./bootstrap/polyfills.mjs";
import { onReady, shouldRender } from "./bootstrap/startup.mjs";
import { createConfig } from "./config/config.mts";
import { createDesign } from "./theme/theme.mts";
import { RankiHud } from "./components/hud/hud.mts";
import { createDevTools } from "./dev/dev.mts";
import { setStyles } from "./style/style.mts";
import { RankiFaces } from "./components/faces/faces.mts";
import { RankiIndicator } from "./components/indicator/indicator.mts";

async function main() {
  try {
    if (!shouldRender()) return;

    setStyles();
    const config = await createConfig();
    createDevTools(config.dev);
    RankiHud.singleton(config.hud, document.body);
    createDesign(config.design);
    RankiIndicator.singleton(config.indicator, document.body);
    RankiFaces.singleton(config.faces, document.body);
  } catch (e) {
    const { createAppErrorScreen } =
      await import("./components/general-error/general-error.mjs");
    createAppErrorScreen(document.body, e);
  }
}

onReady(main);
