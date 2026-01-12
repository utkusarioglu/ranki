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
import { DqmDemoError } from "_error";

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
  jss: HTMLScriptElement[];
  css: HTMLStyleElement[];
};

function createCardElements(
  parts: RankiFiles,
  re: Record<string, string>,
): CardElements {
  const htmlTemplates = Object.values(parts.html);
  if (htmlTemplates.length > 1) {
    throw new DqmDemoError({
      code: "TOO_MANY_TEMPLATES",
      why: "Only a single template is expected",
      cause: null,
    });
  }
  let html = htmlTemplates[0];
  Object.entries(re).forEach(([s, r]) => {
    html = html.replace(s, r);
  });

  // const jss: HTMLScriptElement[] = [];
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  const fragment = tpl.content;

  const js = Object.entries(parts.js).map(([name, j]) => {
    const jsScript = document.createElement("script");
    jsScript.type = "module";
    jsScript.id = name.replace(".", "-");
    jsScript.innerHTML = j;
    return jsScript;
  });

  const css = Object.entries(parts.css).map(([name, j]) => {
    const style = document.createElement("style");
    // jsScript.type = "module";
    style.id = name.replace(".", "-");
    style.innerHTML = j;
    return style;
  });

  return { fragment, html, jss: js, css };
}

const s = useDqmStore.getState();
interface AnkiDesktopIFrameProps {
  inputs: DqmParseInputStructured;
  pref: IDqmRendererClientPreferences;
  size: NumberTuple;
  files: RankiFiles;
}

export const AnkiDesktopIFrame: FC<AnkiDesktopIFrameProps> = ({
  inputs,
  pref,
  size,
  files,
}) => {
  const ref = useRef<HTMLIFrameElement>(null);
  const replaced = createCardElements(files, {
    // These need to be replaced in the demo app
    "{{FACE}}": "A",
    "{{TEMPLATE_CONFIG}}": "   ",
    // These come from anki
    "{{CardConfig}}": "   ",
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
          const base = doc.querySelector("base") as HTMLBaseElement;
          base.href = window.location.origin;
          doc.body.appendChild(replaced.fragment);

          replaced.css.forEach((css) => {
            doc.body.appendChild(css);
          });
          replaced.jss.forEach((js) => {
            doc.body.appendChild(js);
          });
          dqmOnLoad(doc, s.pluginSelection, s.inputs, pref);
        }}
      />
    </>
  );
};
