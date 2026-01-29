import "./bootstrap/polyfills.mjs";
import { onReady, shouldRender } from "./bootstrap/startup.mjs";
import { collectConfig, createState } from "./config/config.mts";
import { createDesign } from "./theme/theme.mts";
import { RankiHud } from "./components/hud/hud.mts";
import { createDevTools } from "./dev/dev.mts";
import { setStyles } from "./style/style.mts";
import { RankiChallenge } from "./components/challenge/challenge.mts";
import { RankiIndicator } from "./components/indicator/indicator.mts";
import type { RankiState } from "./config/config.types.mts";

async function main() {
  try {
    if (!shouldRender()) return;

    setStyles();
    const config = await collectConfig();
    const state = createState(config);
    render(state);
  } catch (e) {
    const { createAppErrorScreen } =
      await import("./components/general-error/general-error.mjs");
    createAppErrorScreen(document.body, e);
  }
}

function render(state: RankiState) {
  createDevTools(state.dev);
  RankiHud.singleton(state.hud, document.body);
  createDesign(state.design);
  RankiIndicator.singleton(state.indicator, document.body);
  RankiChallenge.singleton(state.challenge, document.body);
}

onReady(main);
