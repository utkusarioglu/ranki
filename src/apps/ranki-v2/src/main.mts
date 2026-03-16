import "./bootstrap/polyfills.mjs";
import { onReady, shouldRender } from "_/bootstrap/startup.mjs";
import { collectConfig, createState } from "_/config/config.mts";
import { createDesign } from "_/design/design.mts";
import { createDevTools } from "_/dev/dev.mts";
import { setStyles } from "_/style/style.mts";
import { RChallenge } from "_components/challenge/challenge.mts";
import { RIndicator } from "_components/indicator/indicator.mts";
import type { RankiState } from "_config/config.types.mts";
import { RBigError } from "_components/big-error/big-error.mjs";
import { RHud } from "_components/hud/hud.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";

export async function main() {
  try {
    const renderState = shouldRender();
    switch (renderState) {
      case "stop":
        return;
      case "remove":
        RBigError.removeAll();
        RHud.removeAll();
        RChallenge.removeAll();
        RIndicator.removeAll();
        break;
      case "render":
        RBigError.removeAll();
        setStyles();
        const config = await collectConfig();
        const state = createState(config);
        render(state);
        break;
      default:
        throw new RankiAppError({
          code: "UNRECOGNIZED_RENDER_STATE",
          why: "Render state is not recognized",
          details: { renderState },
          cause: null,
        });
    }
  } catch (e) {
    RBigError.create.singleton(e, document.body);
  }
}

function render(state: RankiState) {
  createDevTools(state.dev);
  RHud.create.singleton(state.hud, document.body);
  createDesign(state.design);
  RIndicator.create.singleton(state.indicator, document.body);
  RChallenge.create.singleton(state.challenge, document.body);
}

onReady(main);
