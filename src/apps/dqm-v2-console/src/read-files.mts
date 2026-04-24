import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "yaml";

export function readFiles(rawRelpath: string, configRelpath: string) {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.join(dirname, "..");
  const rawPath = path.join(repoRoot, rawRelpath);
  const configPath = path.join(repoRoot, configRelpath);

  const raw = fs.readFileSync(rawPath).toString();
  const config = yaml.parse(fs.readFileSync(configPath).toString());
  return { raw, config };
}
