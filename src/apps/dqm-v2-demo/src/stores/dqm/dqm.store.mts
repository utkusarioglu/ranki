import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { DqmStore } from "./dqm.store.types.mts";
import { INPUTS, AUTO_UPDATE } from "./dqm.initial.mts";
import { createDqmParsedProp } from "./dqm.utils.mts";
import { deferredParseDqmInput } from "./dqm.subscriptions.mts";
import { pluginSelectionInit } from "./dqm.plugins.mts";
import type { DqmConfigPack } from "@dqm/package-dqm-api-v2";

const DEFAULT_CONFIG_PACK: DqmConfigPack = {
  // @ts-ignore it expects the entire object
  console: {
    // @ts-ignore it expects the entire object
    plugins: {
      requested: ["ParamsV2", "FrameV2"],
    },
  },
};

export const useDqmStore = create(
  subscribeWithSelector<DqmStore>((set) => ({
    deferParsing: false,
    inputs: INPUTS,
    singleTemplates: [],
    arrangementTemplates: [],
    autoUpdate: AUTO_UPDATE,
    astView: {},
    configPack: DEFAULT_CONFIG_PACK,
    pluginSelection: pluginSelectionInit,
    ...createDqmParsedProp({
      inputs: INPUTS,
      autoUpdate: AUTO_UPDATE,
      parsed: { state: "success", data: [] },
      configPack: DEFAULT_CONFIG_PACK,
      pluginSelection: pluginSelectionInit,
    }),

    setPluginMemberEnabled: (pluginIndex, memberIndex, enabled) =>
      set((state) => {
        console.log(pluginIndex, memberIndex, enabled);
        const pluginSelection = [...state.pluginSelection];
        const alteredPlugin = { ...state.pluginSelection[pluginIndex] };
        const alteredMember = {
          ...state.pluginSelection[pluginIndex].members[memberIndex],
          enabled,
        };
        alteredPlugin.members[memberIndex] = alteredMember;
        pluginSelection[pluginIndex] = alteredPlugin;
        return { pluginSelection };
      }),

    setPluginEnabled: (pluginIndex, enabled) =>
      set((state) => {
        const pluginSelection = [...state.pluginSelection];
        const alteredPlugin = {
          ...state.pluginSelection[pluginIndex],
          enabled,
        };
        pluginSelection[pluginIndex] = alteredPlugin;
        return { pluginSelection };
      }),

    setPluginInstalled: (pluginIndex, installed) =>
      set((state) => {
        const pluginSelection = [...state.pluginSelection];
        const alteredPlugin = {
          ...state.pluginSelection[pluginIndex],
          installed,
        };
        pluginSelection[pluginIndex] = alteredPlugin;
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

    parseInput: () =>
      set((state) => {
        return createDqmParsedProp({ ...state, autoUpdate: true });
      }),

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
