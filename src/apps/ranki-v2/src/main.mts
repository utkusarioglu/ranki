import "./bootstrap/polyfills.mjs";
import { onReady, shouldRender } from "_/bootstrap/startup.mjs";
import { collectConfig, createState } from "_/config/config.mts";
import { createDesign } from "_/design/design.mts";
import { createDevTools } from "_/dev/dev.mts";
import { setStyles } from "_/style/style.mts";
import { RankiHud } from "_components/hud/hud.mts";
import { RankiChallenge } from "_components/challenge/challenge.mts";
import { RankiIndicator } from "_components/indicator/indicator.mts";
import type { RankiState } from "_config/config.types.mts";
import { RankiBigError } from "_components/big-error/big-error.mjs";
import { RText } from "_components/text/text.mjs";
import { RAddressSegment } from "_components/hud/features/address/segment.mjs";
import { RHud } from "_components/hud/hud.2.mjs";

export async function main() {
  try {
    if (!shouldRender()) return;
    RankiBigError.clear();
    setStyles();
    const config = await collectConfig();
    const state = createState(config);
    render(state);
  } catch (e) {
    RankiBigError.createAndAttach(e, document.body);
  }
}

function render(state: RankiState) {
  createDevTools(state.dev);
  RHud.create.singleton(state.hud, document.body);
  // RankiHud.singleton(state.hud, document.body);
  createDesign(state.design);
  // RankiIndicator.singleton(state.indicator, document.body);
  // RankiChallenge.singleton(state.challenge, document.body);
  // test();
}

onReady(main);
