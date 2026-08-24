import { appStore } from "_store/app/app.mjs";
import { createDevTools } from "./devtools.mjs";

const devState = appStore.getState().state?.dev;
if (devState) {
  createDevTools(devState);
}

appStore.subscribe(
  (s) => s.state,
  (state) => {
    if (state !== null) {
      createDevTools(state.dev);
    }
  },
);
