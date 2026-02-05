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
import { Text } from "_components/t/t.mjs";

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

function test() {
  // if (document.querySelector("div.container")) return;
  // const div = document.createElement("div");
  // div.classList.add("container");
  // div.style.position = "fixed";
  // div.style.top = "0";
  // div.style.left = "0";
  // div.style.display = "flex";
  // div.style.gap = "1em";
  // document.body.appendChild(div);

  // Text.create.instance(
  //   {
  //     text:
  //       "-" +
  //       String.fromCharCode(65 + Math.floor(Math.random() * (97 - 65))).repeat(
  //         Math.floor(Math.random() * 10),
  //       ) +
  //       "-",
  //   },
  //   // { text: "fdfd" },
  //   div,
  // );

  Text.create.singleton(
    {
      text:
        "-" +
        String.fromCharCode(65 + Math.floor(Math.random() * (97 - 65))).repeat(
          Math.floor(Math.random() * 10),
        ) +
        "-",
    },
    // { text: "fdfd" },
    document.body,
  );
}

function render(state: RankiState) {
  test();
  createDevTools(state.dev);
  // RankiHud.singleton(state.hud, document.body);
  // createDesign(state.design);
  // RankiIndicator.singleton(state.indicator, document.body);
  // RankiChallenge.singleton(state.challenge, document.body);
}

onReady(main);
