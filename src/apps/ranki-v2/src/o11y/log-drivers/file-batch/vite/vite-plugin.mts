import { FILE_BATCH_LOG_DRIVER_URL } from "../file-batch.constants.mjs";
import { writeFileMiddleware } from "./vite-middleware.mjs";

export const fileBatchLogDriverVitePlugin = (logRoot: string) => ({
  configureServer(
    // vite doesn't expose the type of `server`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    server: any,
  ) {
    server.middlewares.use(
      FILE_BATCH_LOG_DRIVER_URL,
      writeFileMiddleware(logRoot),
    );
  },
  name: "file-batch-log-driver",
});
