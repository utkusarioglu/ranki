import type { RankiRenderHelper } from "@ranki/package-render-v2";
import html from "./main.html?raw";
import css from "./main.css?raw";

interface TitledBlockHudItem {
  type: string;
  text: string;
}

export function titledBlock(hudItems: TitledBlockHudItem[]): RankiRenderHelper {
  const container = document.createElement("div");
  container.innerHTML = html;
  const element = container.querySelector<HTMLElement>(".container")!;
  const hud = container.querySelector<HTMLElement>(".hud")!;
  const children = container.querySelector<HTMLElement>(".children")!;

  hudItems.forEach(({ type, text }) => {
    const e = document.createElement("titled-block");
    e.classList.add("hud-item");
    e.classList.add(type);
    e.innerText = text;
    hud.appendChild(e);
  });

  return {
    element,
    slots: {
      children,
    },
    subtree: {},
    css: [
      {
        id: "titled-block",
        css,
      },
    ],
    afterMount: [],
    beforeUnmount: [],
  };
}
