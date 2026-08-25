import { DqmDemoError } from "_error";
import type { RankiFiles, RankiElements } from "./AnkiScreen";
import { useEffect, useState } from "react";
import type { RankiAppVariant } from "_stores/anki-dist/anki.store.types.mjs";

const URL_TEMPLATE = "/%";

export function createFragment(parts: RankiFiles) {
  const htmlTemplates = Object.values(parts.html);
  if (htmlTemplates.length > 1) {
    throw new DqmDemoError({
      code: "TOO_MANY_TEMPLATES",
      why: "Only a single template is expected",
      cause: null,
    });
  }
  let html = htmlTemplates[0];
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
    fragment,
    jss: js,
    css,
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

  return { top: dt, left: dl, width: dw, height: dh };
}

type RankiFilesRecord = Record<
  RankiAppVariant,
  Record<"html" | "css" | "js", string[]>
>;

const FILES: RankiFilesRecord = {
  core: {
    html: ["template-core.html"],
    css: ["_ranki2.css"],
    js: ["_ranki2.js"],
  },
  o11y: {
    html: ["template-observable.html"],
    css: ["_ranki2.css"],
    js: ["_ranki2.o11y.js"],
  },
  devtools: {
    html: ["template-devtools.html"],
    css: ["_ranki2.css"],
    js: ["_ranki2.devtools.js"],
  },
};

export function useRankiFiles(appVariant: RankiAppVariant): RankiFiles {
  const [files, setFiles] = useState<RankiFiles>({
    epoch: 0,
    html: {},
    css: {},
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
