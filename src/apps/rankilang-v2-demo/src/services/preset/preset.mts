import { PRESET_FILES } from "./constants.mts";
import type { Preset, PresetGroup } from "./preset.types";

export function fetchPresets(): Promise<PresetGroup[]> {
  return Promise.all(
    PRESET_FILES.map(({ basename, groupName }) =>
      fetch(`/presets/${basename}.ranki-demo`)
        .then((r) => r.text())
        .then((t) => {
          const presets = t
            .split("---")
            .slice(1)
            .reduce((a, c) => {
              const lines = c.split("\n");
              const name = lines.shift()?.trim();
              if (name === undefined) {
                console.log(c);
                throw new Error("no title");
              }
              const value = lines.join("\n").trim();
              a.push({
                name,
                value,
              });
              return a;
            }, [] as Preset[]);
          return {
            groupName,
            presets,
          };
        }),
    ),
  );
}
