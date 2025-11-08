import { type RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
import "prismjs/components/prism-python.js";
import { css } from "./prism-atom-dark.css.mjs";
import { assertTransformParent } from "@ranki/package-api-v2/helpers";

type TitledFrame2Return = {
  element: HTMLDivElement;
  slots: {
    children: HTMLDivElement;
  };
};

function titledFrame2(title: string): TitledFrame2Return {
  const container = document.createElement("div");
  container.style.backgroundColor = "#151515";

  const hud = document.createElement("div");
  hud.style.fontSize = "0.8em";
  hud.style.borderBottomRightRadius = "1em";

  const langName = document.createElement("span");
  langName.innerText = title;
  hud.style.backgroundColor = "#202020";
  hud.style.paddingInline = "1em";
  hud.style.paddingBlock = "0.5em";
  hud.style.width = "max-content";
  hud.appendChild(langName);
  container.appendChild(hud);
  const children = document.createElement("div");
  container.appendChild(children);

  return {
    element: container,
    slots: {
      children,
    },
  };
}

export const codeRenderer: RankiRenderPluginItemRenderFunction = async (t) => {
  assertTransformParent(t);

  const values = t.params
    .filter(({ key }) => key === "positional")
    .filter(({ type }) => type === "setting")[0].values;
  if (values.length > 1) {
    throw new Error("Single value expected");
  }
  const langName = values[0].raw;
  const { element, slots } = titledFrame2(langName);

  return {
    element,
    slots,
    onLoad: [
      async () => {
        await new Promise((r) => setTimeout(r, 1e3));
        let val = 0;
        const grow = () => {
          val += 0.01;
          element.style.scale = (Math.sin(val) + 1).toString();
          if (val < Math.PI) {
            window.requestAnimationFrame(grow);
          }
        };
        window.requestAnimationFrame(grow);
      },
    ],
    css: [
      {
        id: "prism-atom-dark",
        css,
      },
    ].filter((v) => v),
  };
};
