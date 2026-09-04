import type { ColorSchemes } from "_stores/anki-dist/anki.store.types.mjs";

import { useAnkiWinStore } from "_stores/anki-dist/anki-win.store.mjs";
import { AnkiRenderSettings } from "_views/anki-render-settings/RenderSettings";

const COLOR_SCHEMES: ColorSchemes[] = ["dark", "light"];
const ASPECT_RATIOS = ["9:16", "3:4", "1:1", "4:3", "16:9"];
const SCALES = ["0.5", "0.75", "1", "1.25", "1.5", "2", "2.5"];

export const AnkiWinRenderSettings = () => {
  const win = useAnkiWinStore();

  return (
    <AnkiRenderSettings
      aspectRatios={ASPECT_RATIOS}
      colorSchemes={COLOR_SCHEMES}
      scales={SCALES}
      store={win}
    />
  );
};
