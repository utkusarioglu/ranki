import { Dqm } from "@dqm/package-dqm-v2";
import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import paramsV2 from "@dqm/plugin-params-v2";
import frameV2Code from "@dqm/plugin-frame-v2-code";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { DqmParseInputStructured } from "@dqm/package-dqm-api-v2";
import type {
  Arrangement,
  CodeStore,
  ParseResult,
} from "./dqm.store.types.mts";

type CreateDqmParseNeeded = "autoUpdate" | "parsed" | "inputs";

export function parseDqm(input: DqmParseInputStructured): ParseResult {
  try {
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

function createDqmParsedProp(
  state: Pick<CodeStore, CreateDqmParseNeeded> &
    Partial<Omit<CodeStore, CreateDqmParseNeeded>>,
): Pick<CodeStore, "parsed"> {
  if (!state.autoUpdate) {
    return { parsed: state.parsed };
  }
  return {
    parsed: parseDqm(state.inputs),
  };
}

const INPUTS: DqmParseInputStructured =
  JSON.parse(localStorage.getItem("current")!) || [];

const AUTO_UPDATE = JSON.parse(localStorage.getItem("autoUpdate")!) || true;

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const debounceEvent = debounce(() => {
  useCodeStore.getState().parseInput();
}, 300);

const deferredParseDqmInput = () => {
  const { autoUpdate, deferParsing, parseInput } = useCodeStore.getState();
  if (autoUpdate) {
    if (deferParsing) {
      debounceEvent();
    } else {
      parseInput();
    }
  }
};

export const useCodeStore = create(
  subscribeWithSelector<CodeStore>((set) => ({
    deferParsing: false,
    inputs: INPUTS,
    templates: [],
    arrangements: [],
    autoUpdate: AUTO_UPDATE,

    astView: {},
    ...createDqmParsedProp({
      inputs: INPUTS,
      autoUpdate: AUTO_UPDATE,
      parsed: { state: "success", data: [] },
    }),

    setAutoUpdate: (autoUpdate) => set(() => ({ autoUpdate })),
    setArrangements: (arrangements: Arrangement[]) =>
      set(() => ({ arrangements })),

    setTemplates: (templates) => set(() => ({ templates })),

    setAllInputs: (dqms) =>
      set((state) => {
        const inputs = {
          ...state.inputs,
          dqms: dqms,
        };
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

useCodeStore.subscribe(
  (s) => s.inputs,
  () => deferredParseDqmInput(),
);
