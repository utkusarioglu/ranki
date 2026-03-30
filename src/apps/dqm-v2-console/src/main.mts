import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Dqm } from "@dqm/package-dqm-v2";
import yaml from "yaml";
// import { sanitizeSingle } from "./sanitize.mjs";
import type { IDqmError } from "@dqm/package-dqm-api-v2";
import { pluginsAsArray } from "./dqm.plugins.mjs";
import {
  createSanitizedAst,
  type SanitizedNodeViewPreferences,
} from "@dqm/package-dqm-v2-debug";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(dirname, "..");
const filePath = path.join(repoRoot, "assets/example.dqm");

const file = fs.readFileSync(filePath).toString();

const preferences: SanitizedNodeViewPreferences = {
  hidden: [],
  props: ["idListString", "creator", "cpxUnique"],
  children: ["subtreeNodes", "childrenNodes", "tokenNodes", "spaceNodes"],
  stable: ["sourceString"],
};

export function main(raw: string) {
  const dqm = new Dqm(
    [
      {
        id: "console",
        config: {
          // @ts-ignore it expects the entire object
          plugins: {
            ignoreRenderPlugins: true,
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
    const parsed = dqm.parse(raw);

    const sanitized = createSanitizedAst(
      { state: "success", data: parsed },
      preferences,
      // {
      //   props,
      //   children,
      //   stable,
      //   // props: props.map((f) => ({ id: f, visible: true })),
      //   // hidden: [],
      //   // children: children.map((f) => ({ id: f, visible: true })),
      //   // stable: stable.map((f) => ({ id: f, visible: true })),
      // },
    );

    // const sanitized = parsed.ast.map((n) => ({
    //   theater: n.theater,
    //   sanitized: createSanitizedAst(
    //     { state: "success", data: { ast: [n] } },
    //     {
    //       props: props.map((f) => ({ id: f, visible: true })),
    //       // hidden: [],
    //       children: children.map((f) => ({ id: f, visible: true })),
    //       stable: stable.map((f) => ({ id: f, visible: true })),
    //     },
    //   ),
    //   // sanitized: sanitizeSingle(n.ast, FEATURES),
    // }));
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
