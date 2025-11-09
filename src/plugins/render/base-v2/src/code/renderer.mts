import {
  type RankiRenderPluginItemRenderFunction,
  type RenderClientOptions,
} from "@ranki/package-render-v2";
import "prismjs/components/prism-python.js";
import { assertTransformParent } from "@ranki/package-api-v2/helpers";

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
  const darkMode = options.scheme === "dark";
  const container = document.createElement("div");
  container.style.backgroundColor = darkMode ? "#151515" : "#CCC";

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

export const codeRenderer: RankiRenderPluginItemRenderFunction = async (
  t,
  options,
) => {
  assertTransformParent(t);

  const positionalSettings = t.params
    .filter(({ key }) => key === "positional")
    .filter(({ type }) => type === "setting");
  if (!positionalSettings.length) {
    console.log(t);
    throw new Error("NO POSITIONAL SETTINGS");
  }
  const values = positionalSettings[0].values;
  if (values.length > 1) {
    throw new Error("Single value expected");
  }
  const langName = values[0].raw;
  const { element, slots } = titledFrame2(langName, options);

  return {
    element,
    slots,
    onLoad: [
      async () => {
        await new Promise((r) => setTimeout(r, 1e3));
        let val = 0;
        const grow = () => {
          val += 0.2;
          element.style.translate = (Math.sin(val) * 20).toString() + "px";
          if (val < Math.PI * 3) {
            window.requestAnimationFrame(grow);
          }
        };
        window.requestAnimationFrame(grow);
      },
    ],
  };
};
