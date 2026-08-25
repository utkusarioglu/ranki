import style from "./AnkiAndroid.module.css";
import ankiAndroidSrc from "./anki-android.html?url";
import { AnkiScreen } from "../../views/anki-screen/AnkiScreen";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { useUiStore } from "_stores/ui/ui.store.mjs";
import { useAnkiAndroidStore } from "_stores/anki-dist/anki-android.store.mjs";
import { sendChanges } from "_views/anki-screen/sendChanges";
import { useRef } from "react";

export const AnkiAndroid = () => {
  const ref = useRef<HTMLIFrameElement>(null);
  const dqm = useDqmStore();
  const android = useAnkiAndroidStore();
  const ui = useUiStore();

  sendChanges(android, dqm, ref);

  return (
    <AnkiScreen
      ref={ref}
      onLoad={() => sendChanges(android, dqm, ref)}
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
      Bottom={
        <div className={style.bottom}>
          <div>
            <button></button>
          </div>
        </div>
      }
      deviceClassName={style.device}
      src={ankiAndroidSrc}
      aspect={android.previewAspect}
      scale={android.previewScale}
      reservedWidth={ui.menuWidth}
      appVariant={android.appVariant}
    />
  );
};
