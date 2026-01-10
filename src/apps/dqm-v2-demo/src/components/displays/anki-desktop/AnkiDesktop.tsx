import style from "./DocumentRender.module.css";
import { AnkiDesktopIFrame } from "./AnkiDesktopIFrame";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import type { IDqmRendererClientPreferences } from "@dqm/package-dqm-api-v2";
import { useUiStore } from "_stores/ui/ui.store.mjs";

const bod = document.createElement("div");
const h1 = document.createElement("h1");
bod.appendChild(h1);
h1.innerHTML = ["hi", "hello", "meo"].join("<br>");

// @ts-expect-error
const options = {
  scheme: "dark",
};

export const AnkiDesktop = () => {
  const d = useDqmStore();
  const ui = useUiStore();

  const pref: IDqmRendererClientPreferences = { scheme: "dark" };
  return (
    <div className={style.container}>
      <div className={style.frame}>
        <AnkiDesktopIFrame
          size={ui.previewSize}
          pref={pref}
          inputs={d.inputs}
        />
      </div>
    </div>
  );
};
