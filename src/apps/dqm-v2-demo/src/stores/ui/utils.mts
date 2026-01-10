import type { NumberTuple } from "./ui.store.types.mts";

export function getFitting(ratio: number, clip: number): NumberTuple {
  const w = window.innerWidth - clip;
  const h = window.innerHeight - clip;
  if (w > h) {
    return [h * ratio, h];
  } else {
    return [w, w / ratio];
  }
}
