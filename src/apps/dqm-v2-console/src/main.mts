import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Dqm } from "@dqm/package-dqm-v2";
import yaml from "yaml";
import { sanitizeSingle } from "./sanitize.mjs";
import type { IDqmError } from "@dqm/package-dqm-api-v2";
import { pluginsAsArray } from "./dqm.plugins.mjs";
import { TEST } from "@dqm/package-dqm-v2-debug";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(dirname, "..");
const filePath = path.join(repoRoot, "assets/example.dqm");

const file = fs.readFileSync(filePath).toString();

console.log("T", TEST);

export function main(raw: string) {
  const FEATURES = ["idList", "creator", "source", "subtree", "children"];
  const dqm = new Dqm(
    [
      {
        id: "console",
        config: {
          // @ts-ignore it expects the entire object
          plugins: {
            requested: [
              "grammar:ParamsV2",
              "grammar:FrameV2",
              "component-set:BaseV2",
            ],
          },
        },
      },
    ],
    pluginsAsArray,
  );
  try {
    const res = dqm.parse(raw);
    const sanitized = res.ast.map((n) => ({
      theater: n.theater,
      sanitized: sanitizeSingle(n.ast, FEATURES),
    }));
    if (process.argv.includes("print")) {
      console.log(yaml.stringify(sanitized));
    }
  } catch (e) {
    try {
      // @ts-ignore
      console.log(yaml.stringify((e as IDqmError).toExtendedJSON()));
    } catch {
      // @ts-ignore
      console.log(e.toString());
    }
  }
}

main(file);
