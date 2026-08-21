import { FILE_BATCH_LOG_DRIVER_URL } from "../file-batch.constants.mjs";
import { writeFileMiddleware } from "./vite-middleware.mjs";

export const fileBatchLogDriverVitePlugin = (logRoot: string) => ({
  name: "file-batch-log-driver",
  configureServer(server: any) {
    server.middlewares.use(
      FILE_BATCH_LOG_DRIVER_URL,
      writeFileMiddleware(logRoot),
    );
  },
});
