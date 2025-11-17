import { assertTransformLeaf } from "@ranki/package-api-v2/helpers";
import type { RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
import { AnkiUi } from "@ranki/package-anki-ui";
// @ts-expect-error
import { Factory } from "vexflow";
import cssTemplate from "./section.css?raw";
import fontTextBase64 from "./leland.txt?raw";

// ANKI
function prepareFont(
  cssTemplate: string,
  fontName: string,
  fontTextBase64: string,
) {
  const base64 = fontTextBase64.replace(/\s+/g, ""); // strip newlines/whitespace
  const dataUrl = `data:font/woff2;base64,${base64}`;
  const css = cssTemplate
    .replaceAll("%FONT_NAME%", fontName)
    .replaceAll("%DATA_URL%", dataUrl);

  const fontFace = new FontFace(fontName, `url(${dataUrl}) format('woff2')`, {
    weight: "normal",
    style: "normal",
    display: "swap",
  });

  return {
    css,
    fontFace,
  };
}

const fontName = "Leland";

export const section: RankiRenderPluginItemRenderFunction = async (t) => {
  assertTransformLeaf(t);
  const hs = AnkiUi.horizontalScroller();
  const div = document.createElement("div");
  hs.slots.children!.appendChild(div);

  const lines = t.source.raw.trim().split("\n");
  const voices = lines.map((line, i) => {
    const parts = line.split(";");
    const notes = parts[0].trim();
    let stem = "up";
    let time = "4/4";

    if (!parts[1]) {
      if (lines.length === 2 && i === 1) {
        stem = "down";
      } else if (lines.length > 2) {
        throw new Error(
          "MORE THAN TWO LINES, YOU NEED TO DEFINE STEM DIRECTIONS: ...notes; up/down",
        );
      }
    } else {
      stem = parts[1].trim();
    }

    if (parts[2]) {
      time = parts[2].trim();
    }

    return {
      notes,
      stem,
      time,
    };
  });

  let attached = false;

  const font = prepareFont(cssTemplate, fontName, fontTextBase64);

  return {
    element: hs.element,
    css: [
      {
        id: "vexflow-font",
        css: font.css,
      },
      ...hs.css!,
    ],
    afterMount: [
      ...hs.beforeUnmount,
      async () => {
        if (attached) {
          return;
        }
        attached = true;

        if (!div) throw new Error("Div #output not found");
        try {
          await font.fontFace.load(); // will reject on parse error
          document.fonts.add(font.fontFace);

          // Wait until the font is actually usable by layout/rendering
          await document.fonts.ready;

          const vf = new Factory({
            renderer: {
              // @ts-ignore wrong type def by vexflow
              elementId: div,
              width: 200,
              height: 150,
            },
          });
          const score = vf.EasyScore();
          const system = vf.System({
            x: 0,
            y: 0,
          });

          // Create a 4/4 treble stave and add two parallel voices.
          system
            .addStave({
              voices: voices.map(({ notes, stem, time }) =>
                score.voice(score.notes(notes, { stem }), { time }),
              ),
            })
            .addClef("treble")
            .addTimeSignature("4/4");

          // Draw it!
          vf.draw();
        } catch (e) {
          hs.slots.children!.innerText =
            (e as Error).stack ||
            "Error cannot be displayed. but there is an error";
        }
      },
    ],
    beforeUnmount: [...hs.beforeUnmount],
  };
};
