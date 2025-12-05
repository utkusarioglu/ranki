import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Dqm } from "@dqm/package-dqm-v2";
import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import paramsV2 from "@dqm/plugin-params-v2";
import frameV2Code from "@dqm/plugin-frame-v2-code";
import yaml from "yaml";
import { sanitizeSingle } from "./sanitize.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(dirname, "..");
const filePath = path.join(repoRoot, "assets/example.dqm");

const file = fs.readFileSync(filePath).toString();

export function main(raw: string) {
  const FEATURES = ["idList", "creator", "source", "subtree", "children"];
  const dqm = new Dqm(
    {
      // @ts-ignore it expects the entire object
      console: {
        // @ts-ignore it expects the entire object
        plugins: {
          requested: ["ParamsV2", "FrameV2"],
        },
      },
    },
    [baseV2, frameV2, paramsV2, frameV2Code],
  );
  try {
    const res = dqm.parse(raw);
    const sanitized = res.map((n) => ({
      theater: n.theater,
      sanitized: sanitizeSingle(n.ast, FEATURES),
    }));
    console.log(yaml.stringify(sanitized));
  } catch (e) {
    console.log((e as any).toString());
  }
}

main(file);
