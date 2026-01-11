import style from "./DocumentRender.module.css";
import { AnkiDesktopIFrame } from "./AnkiDesktopIFrame";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import type { IDqmRendererClientPreferences } from "@dqm/package-dqm-api-v2";
import { useUiStore } from "_stores/ui/ui.store.mjs";
import { useEffect, useState } from "react";

export type RankiFiles = {
  html: string;
  js: string;
  css: string;
};

function useRankiFiles(): RankiFiles {
  const [files, setFiles] = useState<RankiFiles>({ html: "", js: "", css: "" });

  useEffect(() => {
    Promise.all(
      ["template.html", "_ranki2.js", "_ranki2.css"].map((url) =>
        fetch(`/ranki-v2/${url}`).then((r) => r.text()),
      ),
    ).then(([html, js, css]) => setFiles({ html, js, css }));
  }, []);
  return files;
}

const bod = document.createElement("div");
const h1 = document.createElement("h1");
bod.appendChild(h1);
h1.innerHTML = ["hi", "hello", "meo"].join("<br>");

// @ts-expect-error
const options = {
  scheme: "dark",
};

export const AnkiDesktop = () => {
  const files = useRankiFiles();
  const d = useDqmStore();
  const ui = useUiStore();

  const pref: IDqmRendererClientPreferences = { scheme: "dark" };

  if (files.html === "" || files.js === "" || files.css === "") {
    return (
      <div className={style.container}>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <div className={style.frame}>
        <AnkiDesktopIFrame
          files={files}
          size={ui.previewSize}
          pref={pref}
          inputs={d.inputs}
        />
      </div>
    </div>
  );
};
