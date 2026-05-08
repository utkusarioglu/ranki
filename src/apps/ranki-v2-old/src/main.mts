import "./bootstrap/polyfills.mjs";
import { onReady, shouldRender } from "_/bootstrap/startup.mjs";
import { collectConfig, createState } from "_/config/config.mts";
import { createDevTools } from "_/dev/dev.mts";
import { setStyles } from "_/style/style.mts";
import type { RankiState } from "_config/config.types.mts";
import { RBigError } from "_components/big-error/big-error.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import { RRoot } from "_components/root/root.mjs";

export async function main() {
  try {
    const renderState = shouldRender();
    switch (renderState) {
      case "stop":
        return;
      case "remove":
        RRoot.removeAll();
        RBigError.removeAll();
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
  RRoot.create.singleton(state, document.body);
}

onReady(main);
