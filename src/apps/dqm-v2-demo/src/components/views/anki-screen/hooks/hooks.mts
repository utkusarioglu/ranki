import type { RankiAppVariant } from "_stores/anki-dist/anki.store.types.mjs";

import { useEffect, useState } from "react";

import type { RankiFiles } from "../AnkiScreen.types.mts";

import { URL_TEMPLATE } from "../utils/create-fragment.mts";
import { DEFAULT_RANKI_FILES, R2_VARIANT_FILES } from "./hooks.constants.mts";

export function useDocumentCleaner(src: string, filters?: string[]) {
  const [srcClean, setSrcClean] = useState<null | string>(null);

  useEffect(() => {
    fetch(src)
      .then((v) => v.text())
      .then((str) => {
        if (!filters || !filters.length) {
          setSrcClean(str);
          return;
        }

        const doc = new DOMParser().parseFromString(str, "text/html");
        filters.forEach((t) => {
          const matches = doc.querySelectorAll(t);
          for (const m of matches) {
            m.replaceWith(document.createComment(m.outerHTML));
          }
        });
        const clean = doc.documentElement.outerHTML;
        setSrcClean(clean);
      });
  }, []);

  return srcClean;
}

export function useRankiFiles(appVariant: RankiAppVariant): RankiFiles {
  const [files, setFiles] = useState<RankiFiles>(DEFAULT_RANKI_FILES);

  useEffect(() => {
    Promise.all(
      Object.entries(R2_VARIANT_FILES[appVariant]).map(async ([k, v]) => {
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
