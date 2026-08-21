import { geometry } from "_controllers/geometry/geometry.mjs";

const enabled = true;

geometry.configure({
  observability: {
    log: {
      enabled,
    },
    trace: {
      enabled,
    },
    metrics: {
      enabled,
    },
    debug: {
      enabled,
      // sequencer: {
      //   stutter: 1000,
      // },
    },
  },
});
