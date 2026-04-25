import type { IDqmError } from "@dqm/package-dqm-api-v2";
import { Dqm } from "@dqm/package-dqm-v2";
import {
  createFilteredAst,
  createFilteredCpx,
  type AstNodeFiltersRecord,
  type CpxNodeFiltersRecord,
} from "@dqm/package-dqm-v2-debug";
import type yaml from "yaml";
import { pluginsAsArray } from "./dqm.plugins.mjs";

function dqm(raw: string) {
  try {
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
    const parsed = dqm.parse(raw);
    return parsed;
  } catch (e) {
    try {
      // @ts-ignore
      console.log(yaml.stringify((e as IDqmError).toExtendedJSON()));
    } catch {
      // @ts-ignore
      console.log(e.toString());
    }
    process.exit(1);
  }
}

function handleError(e: unknown) {
  try {
    // @ts-ignore
    console.log(yaml.stringify((e as IDqmError).toExtendedJSON()));
  } catch {
    // @ts-ignore
    console.log(e.toString());
  }
}

export function ast(raw: string, filters: AstNodeFiltersRecord) {
  try {
    const parsed = dqm(raw);
    const sanitized = createFilteredAst(
      { state: "success", data: parsed },
      filters,
    );
    return sanitized;
  } catch (e) {
    handleError(e);
  }
}

export function cpx(raw: string, filters: CpxNodeFiltersRecord) {
  try {
    const parsed = dqm(raw);
    const sanitized = createFilteredCpx(
      { state: "success", data: parsed },
      filters,
    );
    return sanitized;
  } catch (e) {
    handleError(e);
  }
}
