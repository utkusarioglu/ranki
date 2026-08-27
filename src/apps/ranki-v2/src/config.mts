import { geometry } from "_controllers/geometry/geometry.mjs";

const enabled = true;

geometry.configure({
  observability: {
    devtools: {
      enabled,
      // sequencer: {
      //   stutter: 1000,
      // },
    },
    log: {
      enabled,
    },
    metrics: {
      enabled,
    },
    trace: {
      enabled,
    },
  },
});
