import { useRef, type FC } from "react";
import { Dqm } from "@dqm/package-dqm-v2";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { buildPluginSelectionConfig } from "_stores/dqm/dqm.utils.mjs";
import { assertExists } from "_assertions";
import iframeSrc from "./anki-desktop.html?url";
import type { PluginStoreWrapper } from "_stores/dqm/dqm.store.types.mjs";
import type {
  DqmParseInputStructured,
  IDqmRendererClientPreferences,
} from "@dqm/package-dqm-api-v2";
import { pluginsAsArray } from "_stores/dqm/dqm.plugins.mjs";
import type { NumberTuple } from "_stores/ui/ui.store.types.mjs";
import style from "./AnkiDesktopIFrame.module.css";
import type { RankiFiles } from "./AnkiDesktop";
// import rankiV2JsUrl from "_ranki_v2/_ranki2.js?url";
// import rankiV2CssUrl from "_ranki_v2/_ranki2.css?url";
// import rankiV2HtmlUrl from "_ranki_v2/template.html?url";

// fetch(rankiV2CssUrl)
//   .then((t) => t.text())
//   .then((t) => console.log("t", t));

function dqmOnLoad(
  doc: Document,
  pluginSelection: PluginStoreWrapper[],
  inputs: DqmParseInputStructured,
  pref: IDqmRendererClientPreferences,
) {
  const a = doc.querySelector<HTMLDivElement>("#A");
  if (!a) {
    // console.log("no luck");
    return;
  }
  const fixedConfig = buildPluginSelectionConfig(pluginSelection);
  const dqm = new Dqm([fixedConfig], pluginsAsArray);
  assertExists(a, {
    why: "body element has to be available for dqm to render",
  });
  dqm.render(inputs, { [inputs[0].theater]: a }, pref);
}

type CardElements = {
  fragment: DocumentFragment;
  html: string;
  js: HTMLScriptElement;
  css: HTMLStyleElement;
};

function createCardElements(
  parts: RankiFiles,
  re: Record<string, string>,
): CardElements {
  let html = parts.html;
  Object.entries(re).forEach(([s, r]) => {
    html = html.replace(s, r);
  });

  const t = document.createElement("template");
  t.innerHTML = html;
  const fragment = t.content;

  const js = document.createElement("script");
  js.type = "module";
  js.innerHTML = parts.js;

  const css = document.createElement("style");
  // console.log("css", parts.css);
  css.innerHTML = parts.css;

  return { fragment, html, js, css };
}

const s = useDqmStore.getState();
interface AnkiDesktopIFrameProps {
  inputs: DqmParseInputStructured;
  pref: IDqmRendererClientPreferences;
  size: NumberTuple;
  files: RankiFiles;
  // html: string;
  // css: string;
  // js: string;
}
export const AnkiDesktopIFrame: FC<AnkiDesktopIFrameProps> = ({
  inputs,
  pref,
  size,
  files,
}) => {
  const ref = useRef<HTMLIFrameElement>(null);
  const replaced = createCardElements(files, {
    "%FACE%": "A",
    "{{A}}": inputs[0].dqm,
    "{{B}}": "[code|hi]",
    "{{Deck}}": "Tests::Test",
    "{{Subdeck}}": "Test",
    "{{Tags}}": "    ",
    "{{Type}}": "A",
    "{{CardFlag}}": "flag0",
    "{{Card}}": "card",
  });

  return (
    <>
      <iframe
        ref={ref}
        className={style.container}
        style={{ width: size[0], height: size[1] }}
        src={iframeSrc}
        onLoad={() => {
          const doc = ref.current?.contentDocument!;
          assertExists(doc, { why: "doc is needed" });
          const insert = doc.querySelector("span#template-insert");
          assertExists(insert, {
            why: "Anki template should have an insertion point",
          });
          // insert.replaceWith(replaced.fragment);
          // doc.body.appendChild(replaced.fragment);
          doc.body.appendChild(replaced.fragment);
          doc.body.appendChild(replaced.css);
          doc.body.appendChild(replaced.js);
          dqmOnLoad(doc, s.pluginSelection, s.inputs, pref);
        }}
      />
    </>
  );
};
