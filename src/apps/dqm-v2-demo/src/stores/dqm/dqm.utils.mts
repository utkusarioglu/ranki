import { Dqm } from "@dqm/package-dqm-v2";
import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import paramsV2 from "@dqm/plugin-params-v2";
import frameV2Code from "@dqm/plugin-frame-v2-code";
import type { DqmParseInputStructured } from "@dqm/package-dqm-api-v2";
import type { CreateDqmParseNeeded, DqmStore } from "./dqm.store.types.mts";
import type { ParseResult } from "./dqm.utils.types.mts";

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

export function createDqmParsedProp(
  state: Pick<DqmStore, CreateDqmParseNeeded> &
    Partial<Omit<DqmStore, CreateDqmParseNeeded>>,
): Pick<DqmStore, "parsed"> {
  if (!state.autoUpdate) {
    return { parsed: state.parsed };
  }
  return {
    parsed: parseDqm(state.inputs),
  };
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
