import { create } from "zustand";
import { Dqm } from "@dqm/package-dqm-v2";
import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import paramsV2 from "@dqm/plugin-params-v2";
import frameV2Code from "@dqm/plugin-frame-v2-code";
import yaml from "yaml";
import { sanitize } from "./sanitize.mts";

interface CodeStore {
  raw: string;
  parsed: string;
  setRaw: (raw: string) => void;
}

function parseRaw(raw: string) {
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
  try {
    const res = dqm.parse(raw);
    const sanitized = sanitize(res);
    return yaml.stringify(sanitized);
  } catch (e) {
    console.log(e);
    return "failed";
  }
}

export const useCodeStore = create<CodeStore>((set) => ({
  raw: "",
  parsed: "",
  setRaw: (raw: string) =>
    set(() => ({
      raw,
      parsed: parseRaw(raw),
    })),
}));
