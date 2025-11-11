import {
  type RankiRenderPluginItemRenderFunction,
  type RenderClientOptions,
} from "@ranki/package-render-v2";
import { assertTransformParent } from "@ranki/package-api-v2/helpers";
import html from "./container.html?raw";
import css from "./container.css?raw";
import { TEMPgetLanguageName } from "./TEMPgetLanguageName.mjs";

type TitledFrame2Return = {
  element: HTMLDivElement;
  slots: {
    children: HTMLDivElement;
  };
};

function titledFrame2(
  title: string,
  options: RenderClientOptions,
): TitledFrame2Return {
  // const darkMode = options.scheme === "dark";
  // const container = document.createElement("div");
  // container.style.backgroundColor = darkMode ? "#151515" : "#CCC";
  // container.style.marginBottom = "1em";

  // const hud = document.createElement("div");
  // hud.style.fontSize = "0.8em";
  // hud.style.borderBottomRightRadius = "1em";

  // const langName = document.createElement("span");
  // langName.innerText = title;
  // hud.style.backgroundColor = "#202020";
  // hud.style.paddingInline = "1em";
  // hud.style.paddingBlock = "0.5em";
  // hud.style.width = "max-content";
  // hud.appendChild(langName);
  // container.appendChild(hud);
  // const children = document.createElement("div");
  // container.appendChild(children);
  const container = document.createElement("div");
  container.innerHTML = html;
  const element = container.querySelector<HTMLDivElement>(".block-wrapper")!;
  element.classList.add(["color-scheme", options.scheme].join("-"));
  const children = container.querySelector<HTMLDivElement>(".placeholder")!;
  const langName = container.querySelector<HTMLDivElement>(".lang-name")!;
  langName.innerText = title;

  const filePath = container.querySelector<HTMLDivElement>(".file-path")!;
  filePath.innerText = "c:/cat/dog.html";

  return {
    element,
    slots: {
      children,
    },
  };
}

export const codeContainer: RankiRenderPluginItemRenderFunction = async (
  t,
  options,
) => {
  assertTransformParent(t);
  const langName = TEMPgetLanguageName(t);

  const { element, slots } = titledFrame2(langName, options);

  return {
    element,
    slots,
    css: [
      {
        id: "code-block-container",
        css,
      },
    ],
    onLoad: [
      async () => {
        await new Promise((r) => setTimeout(r, 1e3));
        let val = 0;
        const grow = () => {
          val += 0.03;
          element.style.opacity = val.toString();
          if (val < 1) {
            window.requestAnimationFrame(grow);
          }
        };
        window.requestAnimationFrame(grow);
      },
    ],
  };
};
