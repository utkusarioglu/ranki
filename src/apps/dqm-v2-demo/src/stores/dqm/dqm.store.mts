import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import type {
  ConfigInput,
  DqmStore,
  DqmStoreState,
  PluginStoreWrapper,
} from "./dqm.store.types.mts";

import { AUTO_UPDATE, INPUTS } from "./dqm.initial.mts";
import { devPluginSelection } from "./dqm.plugins.mts";
import { deferredParseDqmInput } from "./dqm.subscriptions.mts";
import { createDqmParsedProp } from "./dqm.utils.mts";

const pluginSelectionInit: PluginStoreWrapper[] = devPluginSelection.map(
  ({ installed, name, plugin, requested, standard }, packageIndex) => ({
    enabled: true,
    name: name,
    packageIndex,
    plugins: plugin.map((plugin: any, pluginIndex: number) => ({
      description: plugin.meta.description,
      installed,

      name: plugin.meta.name,
      packageIndex,
      plugin,
      pluginIndex,

      pluginType: plugin.type,
      requested,
      standard,
    })),
  }),
);

const dqmStoreInitial: DqmStoreState = {
  arrangementTemplates: [],
  autoUpdate: AUTO_UPDATE,
  configPack: [],
  deferParsing: false,
  inputs: INPUTS,
  pluginSelection: pluginSelectionInit,
  singleTemplates: [],
  ...(await createDqmParsedProp({
    autoUpdate: AUTO_UPDATE,
    configPack: [],
    inputs: INPUTS,
    parsed: { data: { ast: [], ser: [], trn: [] }, state: "success" },
    parseEpoch: 0,
    pluginSelection: pluginSelectionInit,
  })),
};

export const useDqmStore = create(
  subscribeWithSelector<DqmStore>((set, get) => ({
    ...dqmStoreInitial,

    parseInput: async () => {
      const state = get();
      const parsed = await createDqmParsedProp({ ...state, autoUpdate: true });
      set(parsed);
    },

    pushNewConfig: () =>
      set((state) => {
        const index = state.configPack.length;
        const configPack: ConfigInput[] = [
          ...state.configPack,
          {
            config: {},
            configString: "",
            id: `config${index}`,
          } as ConfigInput,
        ];
        return {
          configPack,
        };
      }),

    pushNewTheater: () =>
      set((state) => {
        const inputs = [...state.inputs];
        inputs.push({
          dqm: "",
          theater: "theater" + inputs.length,
        });
        return { inputs };
      }),

    removeConfigByIndex: (index) =>
      set((state) => {
        const configPack: ConfigInput[] = [...state.configPack];
        configPack.splice(index, 1);
        return { configPack };
      }),

    removeTheaterByIndex: (index) =>
      set((state) => {
        const inputs = [...state.inputs];
        inputs.splice(index, 1);
        return { inputs };
      }),

    setAllConfig: (configPack) => set(() => ({ configPack })),

    setAllInputs: (inputs) =>
      set(() => {
        return { inputs };
      }),

    setArrangementTemplates: (arrangements) =>
      set(() => ({ arrangementTemplates: arrangements })),

    setAutoUpdate: (autoUpdate) => set(() => ({ autoUpdate })),

    setConfigCodeByIndex: (index, configCode) =>
      set((state) => {
        const configPack = [...state.configPack];
        configPack[index] = {
          ...configPack[index],
          id: configCode,
        };
        return {
          configPack,
        };
      }),
    setConfigValueByIndex: (index, configString, config) =>
      set((state) => {
        const configPack = [...state.configPack];
        configPack[index] = {
          ...configPack[index],
          config,
          configString,
        };
        return {
          configPack,
        };
      }),

    setDeferParsing: (deferParsing) => set(() => ({ deferParsing })),

    setPluginAsInstalled: (packageIndex, pluginIndex, installed) =>
      set((state) => {
        const plugins = [...state.pluginSelection[packageIndex].plugins];
        plugins[pluginIndex] = {
          ...plugins[pluginIndex],
          installed,
        };
        const alteredPackage = {
          ...state.pluginSelection[packageIndex],
          plugins,
        };
        const pluginSelection = [...state.pluginSelection];
        pluginSelection[packageIndex] = alteredPackage;
        return { pluginSelection };
      }),

    setPluginAsRequested: (packageIndex, pluginIndex, requested) =>
      set((state) => {
        const plugins = [...state.pluginSelection[packageIndex].plugins];
        plugins[pluginIndex] = {
          ...plugins[pluginIndex],
          requested,
        };
        const alteredPackage = {
          ...state.pluginSelection[packageIndex],
          plugins,
        };
        const pluginSelection = [...state.pluginSelection];
        pluginSelection[packageIndex] = alteredPackage;
        return { pluginSelection };
      }),

    setPluginAsStandard: (packageIndex, pluginIndex, standard) =>
      set((state) => {
        const plugins = [...state.pluginSelection[packageIndex].plugins];
        plugins[pluginIndex] = {
          ...plugins[pluginIndex],
          standard,
        };
        const alteredPackage = {
          ...state.pluginSelection[packageIndex],
          plugins,
        };
        const pluginSelection = [...state.pluginSelection];
        pluginSelection[packageIndex] = alteredPackage;
        return { pluginSelection };
      }),

    setPluginPackageAsEnabled: (packageIndex, enabled) =>
      set((state) => {
        const pluginSelection = [...state.pluginSelection];
        const alteredPackage = {
          ...state.pluginSelection[packageIndex],
          enabled,
        };
        pluginSelection[packageIndex] = alteredPackage;
        return { pluginSelection };
      }),

    setSingleTemplates: (templates) =>
      set(() => ({ singleTemplates: templates })),

    setTheaterDqmByIndex: (index, dqm) =>
      set((state) => {
        const inputs = [...state.inputs];
        inputs[index].dqm = dqm;
        localStorage.setItem("current", JSON.stringify(inputs));
        return { inputs };
      }),

    setTheaterNameByIndex: (index, theater) =>
      set((state) => {
        const inputs = [...state.inputs];
        inputs[index].theater = theater;
        return {
          inputs,
        };
      }),
  })),
);

useDqmStore.subscribe(
  (s) => s.inputs,
  () => deferredParseDqmInput(),
);

useDqmStore.subscribe(
  (s) => s.pluginSelection,
  () => deferredParseDqmInput(),
);

useDqmStore.subscribe(
  (s) => s.configPack,
  () => deferredParseDqmInput(),
);
