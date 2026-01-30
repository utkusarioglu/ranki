import "./bootstrap/polyfills.mjs";
import { onReady, shouldRender } from "_/bootstrap/startup.mjs";
import { collectConfig, createState } from "_/config/config.mts";
import { createDesign } from "_/design/design.mts";
import { createDevTools } from "_/dev/dev.mts";
import { setStyles } from "_/style/style.mts";
import { RankiHud } from "_components/hud/hud.mts";
import { RankiChallenge } from "_components/challenge/challenge.mts";
import { RankiIndicator } from "_components/indicator/indicator.mts";
import type { RankiState } from "./config/config.types.mts";
import { ERROR_ID_SELECTOR } from "./selector.constants.mts";

async function main() {
  try {
    if (!shouldRender()) return;
    const err = document.querySelector(ERROR_ID_SELECTOR);
    if (err) {
      err.parentElement?.removeChild(err);
    }

    setStyles();
    const config = await collectConfig();
    const state = createState(config);
    render(state);
  } catch (e) {
    const { createAppErrorScreen } =
      await import("_components/general-error/general-error.mjs");
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
