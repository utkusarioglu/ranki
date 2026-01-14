import type {
  DqmParseInputStructured,
  IDqmRendererClientPreferences,
} from "@dqm/package-dqm-api-v2";
import { assertExists } from "_assertions";
import { pluginsAsArray } from "_stores/dqm/dqm.plugins.mjs";
import type { PluginStoreWrapper } from "_stores/dqm/dqm.store.types.mjs";
import { buildPluginSelectionConfig } from "_stores/dqm/dqm.utils.mjs";
import { Dqm } from "@dqm/package-dqm-v2";
import { DqmDemoError } from "_error";
import type { RankiFiles, CardElements } from "./AnkiScreen";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { useEffect, useState } from "react";

export function dqmOnLoad(
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
export function createCardElements(
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

export function getSizing(
  padding: number,
  aspect: number,
  scale: number,
  reservedWidth: number,
  reservedHeight: number,
) {
  const PAD = padding;
  const S = scale;
  const A = aspect;
  const RW = reservedWidth;
  const RH = reservedHeight;
  const W = window.innerWidth;
  const H = window.innerHeight;
  const cw = W - RW - PAD * 2;
  const ch = H - RH - PAD * 2;

  let dw: number;
  let dh: number;

  if (cw / ch > A) {
    dh = ch;
    dw = ch * A;
  } else {
    dw = cw;
    dh = cw / A;
  }

  dw = dw * S;
  dh = dh * S;

  const dl = (cw - dw) / 2 + PAD;
  const dt = (ch - dh) / 2 + PAD;

  return { top: dt, left: dl, width: dw, height: dh };
}

const FILES = {
  html: ["template.html"],
  css: ["_ranki2.css"],
  js: ["_ranki2.js"],
};

const URL_TEMPLATE = "/ranki-v2/%";

export function useRankiFiles(): RankiFiles {
  const dqm = useDqmStore();
  const [files, setFiles] = useState<RankiFiles>({
    epoch: 0,
    html: {},
    css: {},
    js: {},
  });

  useEffect(() => {
    Promise.all(
      Object.entries(FILES).map(async ([k, v]) => {
        const l = await Promise.all(
          Object.entries(v).map(async ([i, url]) => {
            const val = await fetch(URL_TEMPLATE.replace("%", url));
            const text = await val.text();
            const name =
              // @ts-expect-error
              v[i];
            return [name, text];
          }),
        );
        return [k, l];
      }),
    )
      .then((t) =>
        Object.fromEntries(
          t.map(([t, n]) => [
            t,
            Object.fromEntries(
              // @ts-expect-error
              n,
            ),
          ]),
        ),
      )
      .then((v) => setFiles(v));
  }, [dqm.inputs]);
  return files;
}
