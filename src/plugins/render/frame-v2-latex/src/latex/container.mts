import {
  type RankiRenderPluginItemRenderFunction,
  type RenderClientOptions,
} from "@ranki/package-render-v2";
import { assertTransformParent } from "@ranki/package-api-v2/helpers";
import css from "./container.css?raw";

type TitledFrame2Return = {
  element: HTMLDivElement;
  slots: {
    children: HTMLDivElement;
  };
};

// function titledFrame2(
//   title: string,
//   options: RenderClientOptions,
// ): TitledFrame2Return {
//   const darkMode = options.scheme === "dark";
//   const container = document.createElement("div");
//   container.style.backgroundColor = darkMode ? "#151515" : "#CCC";
//   container.style.marginBottom = "1em";
//   container.classList.add("latex-block");

//   const hud = document.createElement("div");
//   hud.style.fontSize = "0.8em";
//   hud.style.borderBottomRightRadius = "1em";

//   const langName = document.createElement("span");
//   langName.innerText = title;
//   hud.style.backgroundColor = "#202020";
//   hud.style.paddingInline = "1em";
//   hud.style.paddingBlock = "0.5em";
//   hud.style.width = "max-content";
//   hud.appendChild(langName);
//   container.appendChild(hud);
//   const children = document.createElement("div");
//   container.appendChild(children);

//   return {
//     element: container,
//     slots: {
//       children,
//     },
//   };
// }

function blankFrame(
  // title: string,
  options: RenderClientOptions,
): TitledFrame2Return {
  const element = document.createElement("div");
  element.classList.add(options.scheme);
  element.classList.add("latex-block");
  element.classList.add("sections-container");
  const children = document.createElement("div");
  element.appendChild(children);
  return {
    element,
    slots: {
      children,
    },
  };
}

export const latexContainer: RankiRenderPluginItemRenderFunction = async (
  t,
  options,
) => {
  assertTransformParent(t);

  // const positionalSettings = t.params
  //   .filter(({ key }) => key === "positional")
  //   .filter(({ type }) => type === "setting");
  // if (!positionalSettings.length) {
  //   console.log(t);
  //   throw new Error("NO POSITIONAL SETTINGS");
  // }
  // const values = positionalSettings[0].values;
  // if (values.length > 1) {
  //   throw new Error("Single value expected");
  // }
  // const langName = values[0].raw;
  // const { element, slots } = titledFrame2("latex!", options);
  const { element, slots } = blankFrame(options);

  return {
    element,
    slots,
    css: [
      {
        id: "latex-block-sections-container",
        css,
      },
    ],
    onLoad: [
      async () => {
        // await new Promise((r) => setTimeout(r, 1e3));
        let val = 0;
        const grow = () => {
          element.style.opacity = val.toString();
          val += 0.01;
          if (val < 1) {
            window.requestAnimationFrame(grow);
          }
        };
        window.requestAnimationFrame(grow);
      },
    ],
  };
};
