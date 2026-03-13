import style from "./AnkiWindows.module.css";
import ankiWinSrc from "./anki-windows.html?url";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import type { IDqmRendererClientPreferences } from "@dqm/package-dqm-api-v2";
import { AnkiScreen } from "_views/anki-screen/AnkiScreen";
import { useAnkiWinStore } from "_stores/anki-dist/anki-win.store.mjs";
import { useUiStore } from "_stores/ui/ui.store.mjs";
import { useRef, type RefObject } from "react";
import type { AnkiDistStore } from "_stores/anki-dist/anki.store.types.mjs";
import type { DqmStore } from "_stores/dqm/dqm.store.types.mjs";

export const AnkiWindows = () => {
  const ref = useRef<HTMLIFrameElement>(null);
  const dqm = useDqmStore();
  const win = useAnkiWinStore();
  const ui = useUiStore();

  console.log("w", win);
  // useEffect(() => {
  sendChanges(win, dqm, ref);
  // }
  // }, [win.face, dqm, ref.current]);

  return (
    <AnkiScreen
      onLoad={() => {
        console.log("onload", JSON.stringify(dqm.inputs));
        sendChanges(win, dqm, ref);
      }}
      ref={ref}
      Top={
        <div>
          <div className={style.osTop}>
            Anki
            <div>
              <div></div>
            </div>
          </div>
          <div className={style.ankiTop} />
        </div>
      }
      Bottom={
        <div>
          <div className={style.ankiBottom} />
          <div className={style.osBottom}>
            <button />
          </div>
        </div>
      }
      deviceClassName={style.device}
      src={ankiWinSrc}
      aspect={win.previewAspect}
      scale={win.previewScale}
      reservedWidth={ui.menuWidth}
      // inputs={dqm.inputs}
      // templateConfig={win.templateConfig}
      // cardConfig={win.cardConfig}
      // pref={pref}
      // deck={win.deck}
      // tags={win.tags}
      // flag={win.flag}
      // face={win.face}
      // cardType={win.cardType}
      // card={win.card}
    />
  );
};

function sendChanges(
  win: AnkiDistStore,
  dqm: DqmStore,
  ref: RefObject<HTMLIFrameElement | null>,
) {
  if (ref.current) {
    const pref: IDqmRendererClientPreferences = { scheme: win.colorScheme };
    const ranki = {
      fields: {
        a: dqm.inputs[0].dqm,
        b: dqm.inputs[1].dqm,
        deck: win.deck,
        tags: win.tags,
        flag: win.flag,
        face: win.face,
        type: win.cardType,
        card: win.card,
      },
      pref,
    };
    ref.current.contentWindow!.postMessage({
      type: "ranki-update",
      ranki,
    });
  }
}
