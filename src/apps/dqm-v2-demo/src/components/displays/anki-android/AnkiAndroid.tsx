import { useAnkiAndroidStore } from "_stores/anki-dist/anki-android.store.mjs";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { useUiStore } from "_stores/ui/ui.store.mjs";
import { sendChanges } from "_views/anki-screen/sendChanges";
import { useRef } from "react";

import { AnkiScreen } from "../../views/anki-screen/AnkiScreen";
import ankiAndroidSrc from "./anki-android.html?url";
import style from "./AnkiAndroid.module.css";

export const AnkiAndroid = () => {
  const ref = useRef<HTMLIFrameElement>(null);
  const dqm = useDqmStore();
  const android = useAnkiAndroidStore();
  const ui = useUiStore();

  sendChanges(android, dqm, ref);

  return (
    <AnkiScreen
      appVariant={android.appVariant}
      aspect={android.previewAspect}
      Bottom={
        <div className={style.bottom}>
          <div>
            <button></button>
          </div>
        </div>
      }
      deviceClassName={style.device}
      onLoad={() => sendChanges(android, dqm, ref)}
      ref={ref}
      reservedWidth={ui.menuWidth}
      scale={android.previewScale}
      src={ankiAndroidSrc}
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
              .map(() => (
                <div />
              ))}
          </div>
        </div>
      }
    />
  );
};
