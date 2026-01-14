import { useUiStore } from "_stores/ui/ui.store.mjs";
import type { NumberTuple } from "./anki.store.types.mts";

export function getFitting(ratio: number, clip: number): NumberTuple {
  const menuWidth = useUiStore.getState().menuWidth;
  const fw = window.innerWidth - clip - menuWidth;
  const fh = window.innerHeight - clip;
  if (fw > fh) {
    console.log("ww chosen");
    if (ratio < 1) {
      return [fh * ratio, fh];
    } else {
      return [fw, fw / ratio];
    }
  } else {
    if (ratio < 1) {
      return [fh * ratio, fh];
    } else {
      return [fw, fw / ratio];
    }
  }
}
