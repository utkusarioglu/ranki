import { useRef, type FC } from "react";
import { Dqm } from "@dqm/package-dqm-v2";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { buildPluginSelectionConfig } from "_stores/dqm/dqm.utils.mjs";
import { assertExists } from "_assertions";
import type { PluginStoreWrapper } from "_stores/dqm/dqm.store.types.mjs";
import type {
  DqmParseInputStructured,
  IDqmRendererClientPreferences,
} from "@dqm/package-dqm-api-v2";
import { pluginsAsArray } from "_stores/dqm/dqm.plugins.mjs";
import type { NumberTuple } from "_stores/ui/ui.store.types.mjs";
import style from "./AnkiIFrame.module.css";
import { DqmDemoError } from "_error";

function dqmOnLoad(
  doc: Document,
  pluginSelection: PluginStoreWrapper[],
  inputs: DqmParseInputStructured,
  pref: IDqmRendererClientPreferences,
) {
  const a = doc.querySelector<HTMLDivElement>("#A");
  if (!a) {
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

export type RankiFiles = {
  epoch: number;
  html: Record<string, string>;
  css: Record<string, string>;
  js: Record<string, string>;
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
  src: string;
}

export const AnkiIFrame: FC<AnkiDesktopIFrameProps> = ({
  inputs,
  pref,
  size,
  files,
  src,
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
        src={src}
        onLoad={() => {
          const doc = ref.current?.contentDocument!;
          assertExists(doc, { why: "doc is needed" });
          const base = doc.querySelector("base") as HTMLBaseElement;
          if (base) {
            base.href = window.location.origin;
          }
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
