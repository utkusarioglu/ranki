import type {
  DqmConfigPack,
  DqmConfigPackEntry,
  DqmParseInputStructured,
  DqmPluginName,
  IDqmPlugin,
} from "@dqm/package-dqm-api-v2";

import { Dqm } from "@dqm/package-dqm-v2";
import yaml from "yaml";

import type {
  CreateDqmParseNeeded,
  DqmStore,
  PluginStoreWrapper,
} from "./dqm.store.types.mts";
import type { SanitizedParseResult } from "./dqm.utils.types.mts";

// export function renderDqm(
//   input: DqmParseInputStructured,
//   config: DqmConfigPack,
//   plugins: IDqmPlugin[],
// ): ParseResult {
//   try {
//     const dqm = new Dqm(config, plugins);
//     // dqm.setRenderer(DqmStaticRenderer);
//     const data = dqm.parse(input);

//     return {
//       state: "success",
//       data,
//     };
//   } catch (e) {
//     return {
//       state: "fail",
//       // TODO this isn't a string
//       error: e as string,
//     };
//   }
// }

export function buildPluginSelectionConfig(
  pluginSelection: PluginStoreWrapper[],
): DqmConfigPackEntry {
  const standards: DqmPluginName[] = [];
  pluginSelection.forEach((pac) =>
    pac.plugins.forEach(
      (plu) =>
        plu.standard && standards.push([plu.pluginType, plu.name].join(":")),
    ),
  );
  const requested: DqmPluginName[] = [];
  pluginSelection.forEach((pac) =>
    pac.plugins.forEach(
      (plu) =>
        plu.requested && requested.push([plu.pluginType, plu.name].join(":")),
    ),
  );

  const pluginSelectionConfig: DqmConfigPackEntry = {
    config: {
      // @ts-expect-error
      plugins: {
        ...(standards.length && { standards }),
        ...(requested.length && { requested }),
      },
    },
    id: "pluginSelectionConfig",
  };
  return pluginSelectionConfig;
}

export async function createDqmParsedProp(
  state: Partial<Omit<DqmStore, CreateDqmParseNeeded>> &
    Pick<DqmStore, CreateDqmParseNeeded>,
): Promise<Pick<DqmStore, "parsed" | "parseEpoch">> {
  if (!state.autoUpdate) {
    return {
      parsed: state.parsed,
      parseEpoch: 0,
    };
  }

  try {
    const plugins = state.pluginSelection
      .map((p) => {
        const plugins = p.plugins.filter((m) => m.installed);
        return { ...p, plugins };
      })
      .filter((p) => p.enabled && !!p.plugins.length)
      .map((p) => p.plugins.map((m) => m.plugin));

    const config: DqmConfigPack = [
      ...state.configPack
        .filter((c) => !!c.configString.length)
        .map((c) => ({
          config: yaml.parse(c.configString),
          id: c.id,
        })),
      buildPluginSelectionConfig(state.pluginSelection),
    ];
    const parsed = await parseDqm(state.inputs, config, plugins);
    return {
      parsed,
      parseEpoch: Date.now(),
    };
  } catch (e) {
    console.log(e);
    return {
      parsed: state.parsed,
      parseEpoch: state.parseEpoch,
    };
  }
}

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

async function parseDqm(
  input: DqmParseInputStructured,
  config: DqmConfigPack,
  plugins: IDqmPlugin[],
): Promise<SanitizedParseResult> {
  try {
    const dqm = new Dqm(config, plugins);
    const data = await dqm.parse(input);

    return {
      data,
      state: "success",
    };
  } catch (e) {
    return {
      // TODO this isn't a string
      error: e as string,
      state: "fail",
    };
  }
}
