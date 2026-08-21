import fs from "node:fs/promises";
import path from "node:path";

export function writeFileMiddleware(root: string) {
  return async (req: any, res: any, next: any) => {
    if (req.method !== "POST") {
      next();
      return;
    }

    const url = new URL(req.url ?? "", "http://localhost");
    const fileName = url.pathname.slice(1);

    if (!fileName) {
      res.statusCode = 400;
      res.end("Missing file name");
      return;
    }

    let body = "";
    for await (const chunk of req) {
      body += chunk;
    }

    const filePath = path.join(root, fileName);

    await fs.mkdir(root, { recursive: true });
    await fs.appendFile(filePath, body);

    res.statusCode = 204;
    res.end();
  };
}
export const FILE_BATCH_LOG_DRIVER_URL = "/file-batch-log-driver";

export const fileBatchLogDriverVitePlugin = (logRoot: string) => ({
  name: "file-batch-log-driver",
  configureServer(server: any) {
    server.middlewares.use(
      FILE_BATCH_LOG_DRIVER_URL,
      writeFileMiddleware(logRoot),
    );
  },
});
