import { useAnkiWinStore } from "_stores/anki-dist/anki-win.store.mjs";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { useUiStore } from "_stores/ui/ui.store.mjs";
import { AnkiScreen } from "_views/anki-screen/AnkiScreen";
import { sendChanges } from "_views/anki-screen/sendChanges";
import { useRef } from "react";

import ankiWinSrc from "./anki-windows.html?url";
import style from "./AnkiWindows.module.css";
import { EventsDisplay } from "_views/event-display/EventDisplay";

export const AnkiWindows = () => {
  const ref = useRef<HTMLIFrameElement>(null);
  const dqm = useDqmStore();
  const win = useAnkiWinStore();
  const ui = useUiStore();

  sendChanges(win, dqm, ref);

  return (
    <>
      <AnkiScreen
        appVariant={win.appVariant}
        aspect={win.previewAspect}
        Bottom={
          <div>
            <div className={style.ankiBottom} />
            <div className={style.osBottom}>
              <button />
            </div>
          </div>
        }
        deviceClassName={style.device}
        onLoad={() => sendChanges(win, dqm, ref)}
        ref={ref}
        reservedWidth={ui.menuWidth}
        scale={win.previewScale}
        src={ankiWinSrc}
        onEvent={(e) => win.addEvent(e)}
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
      />
      <EventsDisplay events={win.events} />
    </>
  );
};
