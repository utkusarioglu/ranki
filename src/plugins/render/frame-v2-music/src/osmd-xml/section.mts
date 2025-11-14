import { assertTransformLeaf } from "@ranki/package-api-v2/helpers";
import type { RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
import { AnkiUi } from "@ranki/package-anki-ui";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import css from "./section.css?raw";
// import yaml from "yaml";
// import { toXML } from "jstoxml";
// import { jsXml } from "json-xml-parse";

export const section: RankiRenderPluginItemRenderFunction = async (t) => {
  assertTransformLeaf(t);
  const hs = AnkiUi.horizontalScroller();
  const div = document.createElement("pre");
  hs.slots!.content.appendChild(div);

  const xml = t.source.raw.trim();
  // const o = yaml.parse(raw);
  // const xml = jsXml.toXmlString(o);
  // const xml = toXML(o, { indent: "  " });
  console.log(xml);
  // div.innerText = xml;

  return {
    element: hs.element,
    css: [
      {
        id: "osmd",
        css,
      },
      ...hs.css!,
    ],
    afterMount: [
      async () => {
        try {
          var osmd = new OpenSheetMusicDisplay(hs.slots!.content);
          osmd.setOptions({
            backend: "svg",
            drawTitle: true,
            autoResize: false,
            drawingParameters: "compacttight", // don't display title, composer etc., smaller margins
          });
          osmd.load(xml).then(function () {
            window.requestAnimationFrame(() => {
              osmd.Zoom = 0.5;
              osmd.render();
            });
          });
        } catch (e) {
          console.log(e);
          hs.slots!.content.innerText =
            (e as Error).stack || (e as Error).message;
        }
      },
    ],
    beforeUnmount: [async () => {}],
  };
};
