import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Dqm } from "@dqm/package-dqm-v2";
import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import yaml from "yaml";
import { sanitize } from "./sanitize.mjs";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const filePath = path.join(repoRoot, "assets/example.dqm");

const file = fs.readFileSync(filePath).toString();

export function main(raw: string) {
  const dqm = new Dqm({}, [baseV2, frameV2]);
  try {
    const res = dqm.parse(raw);
    const sanitized = sanitize(res);
    console.log(yaml.stringify(sanitized));
  } catch (e) {
    console.log((e as any).toString());
  }
}

main(file);
