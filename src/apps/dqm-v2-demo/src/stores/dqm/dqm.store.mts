import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { DqmStore } from "./dqm.store.types.mts";
import { INPUTS, AUTO_UPDATE } from "./dqm.initial.mts";
import { createDqmParsedProp } from "./dqm.utils.mts";
import { deferredParseDqmInput } from "./dqm.subscriptions.mts";

export const useDqmStore = create(
  subscribeWithSelector<DqmStore>((set) => ({
    deferParsing: false,
    inputs: INPUTS,
    singleTemplates: [],
    arrangementTemplates: [],
    autoUpdate: AUTO_UPDATE,
    astView: {},
    ...createDqmParsedProp({
      inputs: INPUTS,
      autoUpdate: AUTO_UPDATE,
      parsed: { state: "success", data: [] },
    }),

    setAutoUpdate: (autoUpdate) => set(() => ({ autoUpdate })),
    setArrangementTemplates: (arrangements) =>
      set(() => ({ arrangementTemplates: arrangements })),

    setSingleTemplates: (templates) =>
      set(() => ({ singleTemplates: templates })),

    setAllInputs: (inputs) =>
      set(() => {
        // const inputs = {
        //   ...state.inputs,
        //   dqms: dqms,
        // };
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
