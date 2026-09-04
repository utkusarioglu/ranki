import { useAnkiAndroidStore } from "_stores/anki-dist/anki-android.store.mjs";

import ankiAndroidSrc from "./anki-android.html?url";
import style from "./AnkiAndroid.module.css";
import { AnkiDevice } from "_views/anki-device/AnkiDevice";

export const AnkiAndroid = () => {
  const platform = useAnkiAndroidStore();

  return (
    <AnkiDevice
      type="android"
      platform={platform}
      Bottom={
        <div className={style.bottom}>
          <div>
            <button></button>
          </div>
        </div>
      }
      deviceClassName={style.device}
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
  );
};
