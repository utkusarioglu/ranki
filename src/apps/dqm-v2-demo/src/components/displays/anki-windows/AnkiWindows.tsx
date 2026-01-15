import style from "./AnkiWindows.module.css";
import ankiWinSrc from "./anki-windows.html?url";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import type { IDqmRendererClientPreferences } from "@dqm/package-dqm-api-v2";
import { AnkiScreen } from "_views/anki-screen/AnkiScreen";
import { useAnkiWinStore } from "_stores/anki-dist/anki-win.store.mjs";
import { useUiStore } from "_stores/ui/ui.store.mjs";

export const AnkiWindows = () => {
  const dqm = useDqmStore();
  const win = useAnkiWinStore();
  const ui = useUiStore();

  const pref: IDqmRendererClientPreferences = { scheme: win.colorScheme };

  return (
    <AnkiScreen
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
      inputs={dqm.inputs}
      templateConfig={win.templateConfig}
      cardConfig={win.cardConfig}
      pref={pref}
      deck={win.deck}
      tags={win.tags}
      flag={win.flag}
      face={win.face}
      cardType={win.cardType}
    />
  );
};
