import { useAnkiWinStore } from "_stores/anki-dist/anki-win.store.mjs";

import ankiWinSrc from "./anki-windows.html?url";
import style from "./AnkiWindows.module.css";
import { AnkiDevice } from "_views/anki-device/AnkiDevice";

export const AnkiWindows = () => {
  const platform = useAnkiWinStore();
  return (
    <AnkiDevice
      type="windows"
      platform={platform}
      deviceClassName={style.device}
      Bottom={
        <div>
          <div className={style.ankiBottom} />
          <div className={style.osBottom}>
            <button />
          </div>
        </div>
      }
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
  );
};
