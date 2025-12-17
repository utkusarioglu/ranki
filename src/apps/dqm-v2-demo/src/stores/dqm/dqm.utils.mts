import { Dqm } from "@dqm/package-dqm-v2";
import type {
  DqmConfigPack,
  DqmConfigPackEntry,
  DqmParseInputStructured,
  DqmPluginName,
  IDqmPlugin,
} from "@dqm/package-dqm-api-v2";
import type {
  CreateDqmParseNeeded,
  DqmStore,
  PluginStoreWrapper,
} from "./dqm.store.types.mts";
import type { ParseResult } from "./dqm.utils.types.mts";
import yaml from "yaml";

export function parseDqm(
  input: DqmParseInputStructured,
  config: DqmConfigPack,
  plugins: IDqmPlugin[],
): ParseResult {
  try {
    const dqm = new Dqm(config, plugins);
    const data = dqm.parse(input);

    return {
      state: "success",
      data,
    };
  } catch (e) {
    return {
      state: "fail",
      // TODO this isn't a string
      error: e as string,
    };
  }
}

export function createDqmParsedProp(
  state: Pick<DqmStore, CreateDqmParseNeeded> &
    Partial<Omit<DqmStore, CreateDqmParseNeeded>>,
): Pick<DqmStore, "parsed" | "parseEpoch"> {
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
          id: c.id,
          config: yaml.parse(c.configString),
        })),
      buildPluginSelectionConfig(state.pluginSelection),
    ];
    return {
      parsed: parseDqm(state.inputs, config, plugins),
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

export function buildPluginSelectionConfig(
  pluginSelection: PluginStoreWrapper[],
): DqmConfigPackEntry {
  const standards: DqmPluginName[] = [];
  pluginSelection.forEach((pac) =>
    pac.plugins.forEach((plu) => plu.standard && standards.push(plu.name)),
  );
  const requested: DqmPluginName[] = [];
  pluginSelection.forEach((pac) =>
    pac.plugins.forEach((plu) => plu.requested && requested.push(plu.name)),
  );

  const pluginSelectionConfig: DqmConfigPackEntry = {
    id: "pluginSelectionConfig",
    config: {
      // @ts-expect-error
      plugins: {
        ...(standards.length && { standards }),
        ...(requested.length && { requested }),
      },
    },
  };
  return pluginSelectionConfig;
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
