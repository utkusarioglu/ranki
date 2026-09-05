import { assertNotUndefined } from "_error/assertions.mjs";

import { appStore } from "./app.mjs";

export function getAnimationCollection() {
  const collection = appStore.getState().state?.design.animationCollection;
  assertNotUndefined(collection, {
    details: {
      state: appStore.getState().state,
    },
    why: "Animation collection does not exist",
  });
  return collection;
}
