import { useAnkiAndroidStore } from "_stores/anki-dist/anki-android.store.mjs";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { useUiStore } from "_stores/ui/ui.store.mjs";
import { sendChanges } from "_views/anki-screen/utils/send.mjs";
import { EventsDisplay } from "_views/event-display/EventDisplay";
import { useRef } from "react";

import { AnkiScreen } from "../../views/anki-screen/AnkiScreen";
import ankiAndroidSrc from "./anki-android.html?url";
import style from "./AnkiAndroid.module.css";

export const AnkiAndroid = () => {
  const ref = useRef<HTMLIFrameElement>(null);
  const dqm = useDqmStore();
  const platform = useAnkiAndroidStore();
  const ui = useUiStore();

  sendChanges(platform, dqm, ref);

  return (
    <>
      <AnkiScreen
        appVariant={platform.appVariant}
        aspect={platform.previewAspect}
        Bottom={
          <div className={style.bottom}>
            <div>
              <button></button>
            </div>
          </div>
        }
        fetchOverride={platform.fetchOverride}
        deviceClassName={style.device}
        onEvent={(e) => platform.addEvent(e)}
        onLoad={() => sendChanges(platform, dqm, ref)}
        ref={ref}
        reservedWidth={ui.menuWidth}
        scale={platform.previewScale}
        src={ankiAndroidSrc}
        srcFilters={['[src*="file:"]', '[href*="file:"]']}
        Top={
          <div>
            <div className={style.osTop}>
              <div>
                <div />
              </div>
              <div>
                <div />
              </div>
            </div>
            <div className={style.ankiTop}>
              {Array(7)
                .fill(null)
                .map((_, i) => (
                  <div key={i} />
                ))}
            </div>
          </div>
        }
      />
      <EventsDisplay events={platform.events} />
    </>
  );
};
