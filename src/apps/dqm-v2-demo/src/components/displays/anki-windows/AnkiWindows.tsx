import { useAnkiWinStore } from "_stores/anki-dist/anki-win.store.mjs";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { useUiStore } from "_stores/ui/ui.store.mjs";
import { AnkiScreen } from "_views/anki-screen/AnkiScreen";
import { Send } from "_views/anki-screen/utils/send.mjs";
import { EventsDisplay } from "_views/event-display/EventDisplay";
import { useEffect, useRef } from "react";

import ankiWinSrc from "./anki-windows.html?url";
import style from "./AnkiWindows.module.css";
import { useAnkiTelemetry } from "_stores/anki-dist/anki-telemetry.mjs";

export const AnkiWindows = () => {
  const ref = useRef<HTMLIFrameElement>(null);
  const dqm = useDqmStore();
  const telemetry = useAnkiTelemetry();
  const platform = useAnkiWinStore();
  const ui = useUiStore();

  useEffect(() => {
    Send.changes(platform, dqm, ref);
  }, [ref, dqm, platform]);

  return (
    <>
      <AnkiScreen
        appVariant={platform.appVariant}
        aspect={platform.previewAspect}
        Bottom={
          <div>
            <div className={style.ankiBottom} />
            <div className={style.osBottom}>
              <button />
            </div>
          </div>
        }
        fetchOverride={platform.fetchOverride}
        deviceClassName={style.device}
        onEvent={(e) => telemetry.addEvent("windows", e)}
        onLoad={() => Send.changes(platform, dqm, ref)}
        ref={ref}
        reservedWidth={ui.menuWidth}
        scale={platform.previewScale}
        src={ankiWinSrc}
        srcFilters={['[src*="_anki"]', '[href*="_anki"]']}
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
      <EventsDisplay events={telemetry.events} />
    </>
  );
};
