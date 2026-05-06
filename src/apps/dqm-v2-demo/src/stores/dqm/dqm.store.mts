import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  ConfigInput,
  DqmStore,
  DqmStoreState,
  PluginStoreWrapper,
} from "./dqm.store.types.mts";
import { INPUTS, AUTO_UPDATE } from "./dqm.initial.mts";
import { createDqmParsedProp } from "./dqm.utils.mts";
import { deferredParseDqmInput } from "./dqm.subscriptions.mts";
import { devPluginSelection } from "./dqm.plugins.mts";

const pluginSelectionInit: PluginStoreWrapper[] = devPluginSelection.map(
  ({ name, plugin, standard, requested, installed }, packageIndex) => ({
    name: name,
    enabled: true,
    packageIndex,
    plugins: plugin.map((plugin, pluginIndex) => ({
      packageIndex,
      pluginIndex,

      name: plugin.meta.name,
      description: plugin.meta.description,
      plugin,
      pluginType: plugin.type,

      installed,
      standard,
      requested,
    })),
  }),
);

const dqmStoreInitial: DqmStoreState = {
  deferParsing: false,
  inputs: INPUTS,
  singleTemplates: [],
  arrangementTemplates: [],
  autoUpdate: AUTO_UPDATE,
  configPack: [],
  pluginSelection: pluginSelectionInit,
  ...(await createDqmParsedProp({
    inputs: INPUTS,
    autoUpdate: AUTO_UPDATE,
    parsed: { state: "success", data: { ast: [], trn: [], ser: [] } },
    configPack: [],
    pluginSelection: pluginSelectionInit,
    parseEpoch: 0,
  })),
};

export const useDqmStore = create(
  subscribeWithSelector<DqmStore>((set, get) => ({
    ...dqmStoreInitial,

    setAllConfig: (configPack) => set(() => ({ configPack })),

    pushNewConfig: () =>
      set((state) => {
        const index = state.configPack.length;
        const configPack: ConfigInput[] = [
          ...state.configPack,
          {
            id: `config${index}`,
            config: {},
            configString: "",
          } as ConfigInput,
        ];
        return {
          configPack,
        };
      }),

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

    removeConfigByIndex: (index) =>
      set((state) => {
        const configPack: ConfigInput[] = [...state.configPack];
        configPack.splice(index, 1);
        return { configPack };
      }),

    setConfigValueByIndex: (index, configString, config) =>
      set((state) => {
        const configPack = [...state.configPack];
        configPack[index] = {
          ...configPack[index],
          configString,
          config,
        };
        return {
          configPack,
        };
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

    setAutoUpdate: (autoUpdate) => set(() => ({ autoUpdate })),
    setArrangementTemplates: (arrangements) =>
      set(() => ({ arrangementTemplates: arrangements })),

    setSingleTemplates: (templates) =>
      set(() => ({ singleTemplates: templates })),

    setAllInputs: (inputs) =>
      set(() => {
        return { inputs };
      }),

    setTheaterDqmByIndex: (index, dqm) =>
      set((state) => {
        const inputs = [...state.inputs];
        inputs[index].dqm = dqm;
        localStorage.setItem("current", JSON.stringify(inputs));
        return { inputs };
      }),

    pushNewTheater: () =>
      set((state) => {
        const inputs = [...state.inputs];
        inputs.push({
          theater: "theater" + inputs.length,
          dqm: "",
        });
        return { inputs };
      }),

    removeTheaterByIndex: (index) =>
      set((state) => {
        const inputs = [...state.inputs];
        inputs.splice(index, 1);
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

    parseInput: async () => {
      const state = get();
      const parsed = await createDqmParsedProp({ ...state, autoUpdate: true });
      set(parsed);
    },

    setDeferParsing: (deferParsing) => set(() => ({ deferParsing })),
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
