import html from "./main.html?raw";
import css from "./main.css?raw";
import type { RenderNode } from "@dqm/package-dqm-api-v2";

interface TitledInlineHudItem {
  type: string;
  text: string;
}

export function titledInline(hudItems: TitledInlineHudItem[]): RenderNode {
  const container = document.createElement("div");
  container.innerHTML = html;
  const element = container.querySelector<HTMLElement>(".container")!;
  const hud = container.querySelector<HTMLElement>(".hud")!;
  const children = container.querySelector<HTMLElement>(".children")!;

  hudItems.forEach(({ type, text }) => {
    const e = document.createElement("titled-inline");
    e.classList.add("hud-item");
    e.classList.add(type);
    e.innerText = text;
    hud.appendChild(e);
  });

  return {
    element,
    getMount: () => children,
    // slots: {
    //   children,
    // },
    // subtree: {},
    css: [
      {
        id: "titled-inline",
        css,
      },
    ],
    // afterMount: [],
    // beforeUnmount: [],
  };
}
