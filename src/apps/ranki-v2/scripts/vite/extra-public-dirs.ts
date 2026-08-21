import fs from "node:fs";
import sirv from "sirv";

export const extraPublicDirs = (pluginsRootPath: string) => ({
  name: "extra-public-dirs",
  configureServer(server: any) {
    const pluginNames = fs.readdirSync(pluginsRootPath);
    const publicPaths = pluginNames.map((n) => `${pluginsRootPath}/${n}/lib`);
    console.log("Public Paths:\n", "  " + publicPaths.join("\n"));
    for (const p of publicPaths) {
      server.middlewares.use(
        "/",
        sirv(p, {
          dev: true,
        }),
      );
    }
  },
});
