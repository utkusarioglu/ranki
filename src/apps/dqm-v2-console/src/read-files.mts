import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import yaml from "yaml";

export function readFiles(options: any) {
  const dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const repoRoot = path.join(dirname, "..");
  const rawPath = path.join(repoRoot, options.in);
  const configPath = path.join(repoRoot, options.config);

  const raw = fs.readFileSync(rawPath).toString();
  const config = yaml.parse(fs.readFileSync(configPath).toString());
  return { raw, config };
}
