import type { RankiAppVariant } from "_stores/anki-dist/anki.store.types.mjs";

import { DqmDemoError } from "_error";
import { useEffect, useState } from "react";

import type { RankiElements, RankiFiles } from "./AnkiScreen";

const URL_TEMPLATE = "/%";

type RankiFilesRecord = Record<
  RankiAppVariant,
  Record<"css" | "html" | "js", string[]>
>;

export function createFragment(parts: RankiFiles) {
  const htmlTemplates = Object.values(parts.html);
  if (htmlTemplates.length > 1) {
    throw new DqmDemoError({
      cause: null,
      code: "TOO_MANY_TEMPLATES",
      why: "Only a single template is expected",
    });
  }
  const html = htmlTemplates[0];
  const tpl = document.createElement("template");
  const replaced = html.replace(
    "{{STORAGE_CONFIG}}",
    URL_TEMPLATE.replace("%", "_ranki2_user_config.yml"),
  );
  tpl.innerHTML = replaced;
  const fragment = tpl.content;

  const inputElems = fragment.querySelectorAll("*");
  inputElems.forEach((e) => {
    e.innerHTML = "";
  });
  return fragment;
}

export function createRankiElements(parts: RankiFiles): RankiElements {
  const fragment = createFragment(parts);

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

  return {
    css,
    fragment,
    jss: js,
  };
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

  return { height: dh, left: dl, top: dt, width: dw };
}

const FILES: RankiFilesRecord = {
  core: {
    css: ["_ranki2.css"],
    html: ["template-core.html"],
    js: ["_ranki2.js"],
  },
  devtools: {
    css: ["_ranki2.css"],
    html: ["template-devtools.html"],
    js: ["_ranki2.devtools.js"],
  },
  o11y: {
    css: ["_ranki2.css"],
    html: ["template-observable.html"],
    js: ["_ranki2.o11y.js"],
  },
};

export function useRankiFiles(appVariant: RankiAppVariant): RankiFiles {
  const [files, setFiles] = useState<RankiFiles>({
    css: {},
    epoch: 0,
    html: {},
    js: {},
  });

  useEffect(() => {
    Promise.all(
      Object.entries(FILES[appVariant]).map(async ([k, v]) => {
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
  }, [appVariant]);
  return files;
}
