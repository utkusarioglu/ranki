import { useAnkiWinStore } from "_stores/anki-dist/anki-win.store.mjs";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { useUiStore } from "_stores/ui/ui.store.mjs";
import { AnkiScreen } from "_views/anki-screen/AnkiScreen";
import { sendChanges } from "_views/anki-screen/sendChanges";
import { useRef } from "react";
import style from "./AnkiWindows.module.css";
import ankiWinSrc from "./anki-windows.html?url";

export const AnkiWindows = () => {
  const ref = useRef<HTMLIFrameElement>(null);
  const dqm = useDqmStore();
  const win = useAnkiWinStore();
  const ui = useUiStore();

  sendChanges(win, dqm, ref);

  return (
    <AnkiScreen
      onLoad={() => sendChanges(win, dqm, ref)}
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
    />
  );
};
