import { batchLogger } from "_/o11y/log.mjs";
import { geometry } from "_controllers/geometry/geometry.mjs";

geometry.configure({
  log: {
    drivers: [batchLogger],
  },
});
