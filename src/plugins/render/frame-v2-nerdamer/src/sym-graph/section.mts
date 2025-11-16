import { assertTransformLeaf } from "@ranki/package-api-v2/helpers";
import type { RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
import { AnkiUi } from "@ranki/package-anki-ui";
import nerdamer from "nerdamer-prime";
import css from "./section.css?raw";
// @ts-expect-error
import Plotly from "plotly.js-dist-min";

function doTheDeed(div: HTMLElement, mathString: string) {
  const rect = div.getBoundingClientRect();
  const minSize = rect.width - rect.y * 2;

  const xLim = [-1, 1]; // TODO
  const segments = Math.floor(minSize / 2); // TODO

  const hud = document.createElement("div");
  div.appendChild(hud);

  const f = nerdamer(mathString);
  const independent = Array(segments)
    .fill(null)
    .map((_, i) => (i / (segments - 1)) * (xLim[1] - xLim[0]) + xLim[0]);
  const dependent: number[] = [];

  independent.forEach((x) => {
    dependent.push(
      // @ts-expect-error
      +f.evaluate({ x }).text(),
    );
  });

  Plotly.newPlot(
    div,
    [
      {
        y: dependent,
        x: independent,
      },
    ],
    {
      margin: { l: 0, r: 0, t: 0, b: 0 },
      width: minSize,
      height: minSize,
      paper_bgcolor: "transparent",
      plot_bgcolor: "#151515",
      font: {
        color: "#CCC",
      },
      xaxis: {
        color: "#CCC",
        gridcolor: "#333",
        automargin: true,
      },
      yaxis: {
        color: "#CCC",
        gridcolor: "#333",
        automargin: true,
      },
      modebar: {
        color: "#FFFFFF",
        bgcolor: "transparent",
        remove: ["autoScale2d", "autoscale", "pan", "toimage", "zoom"],
      },
    },
    {
      // displayModeBar: "hover",
      displaylogo: false, // hide the Plotly logo
      responsive: true,
    },
  );
}

export const section: RankiRenderPluginItemRenderFunction = async (t) => {
  assertTransformLeaf(t);
  const h = AnkiUi.horizontalScroller();
  h.slots!.left.innerText = ["(", t.depth.toString(), ")"].join("");

  return {
    element: h.element,
    css: [
      {
        id: "plotly",
        css,
      },
      ...h.css!,
    ],
    afterMount: [
      async () => {
        doTheDeed(h.slots!.content, t.source.raw);
      },
    ],
  };
};
