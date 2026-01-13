import style from "./AnkiAndroid.module.css";
import ankiAndroidSrc from "./anki-android.html?url";
import {
  AnkiIFrame,
  type RankiFiles,
} from "../../views/anki-iframe/AnkiIFrame";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import type { IDqmRendererClientPreferences } from "@dqm/package-dqm-api-v2";
import { useUiStore } from "_stores/ui/ui.store.mjs";
import { useEffect, useState } from "react";

const FILES = {
  html: ["template.html"],
  css: ["_ranki2.css"],
  js: ["_ranki2.js"],
};

const URL_TEMPLATE = "/ranki-v2/%";

function useRankiFiles(): RankiFiles {
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
  }, []);
  return files;
}

// @ts-expect-error
const options = {
  scheme: "dark",
};

export const AnkiAndroid = () => {
  const files = useRankiFiles();
  const d = useDqmStore();
  const ui = useUiStore();

  const pref: IDqmRendererClientPreferences = { scheme: "dark" };

  if (files.epoch === 0) {
    return (
      <div className={style.container}>
        <span>Loading...</span>
      </div>
    );
  }

  const [width, height] = ui.previewSize;

  return (
    <div className={style.container}>
      <div className={style.frame}>
        <div className={style.top}>
          {Array(7)
            .fill(null)
            .map(() => (
              <div />
            ))}
        </div>
        <AnkiIFrame
          src={ankiAndroidSrc}
          files={files}
          size={[width, height - 120]}
          pref={pref}
          inputs={d.inputs}
        />
        <div className={style.bottom}>
          <div>
            <button></button>
          </div>
        </div>
      </div>
    </div>
  );
};
