import style from "./AnkiAndroid.module.css";
import ankiAndroidSrc from "./anki-android.html?url";
import { AnkiScreen } from "../../views/anki-screen/AnkiScreen";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import type { IDqmRendererClientPreferences } from "@dqm/package-dqm-api-v2";
import { useUiStore } from "_stores/ui/ui.store.mjs";
import { useAnkiAndroidStore } from "_stores/anki-dist/anki-android.store.mjs";

export const AnkiAndroid = () => {
  const dqm = useDqmStore();
  const android = useAnkiAndroidStore();
  const ui = useUiStore();

  const pref: IDqmRendererClientPreferences = { scheme: android.colorScheme };

  return (
    <AnkiScreen
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
      inputs={dqm.inputs}
      templateConfig={android.templateConfig}
      cardConfig={android.cardConfig}
      pref={pref}
      deck={android.deck}
      tags={android.tags}
      flag={android.flag}
    />
  );
};
