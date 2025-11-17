import type { TransformNode } from "@ranki/package-api-v2";

export const NO_LANGUAGE = "</>";

export function TEMPgetLanguageName(t: TransformNode) {
  try {
    const positionalSettings = t.params
      .filter(({ key }) => key === "positional")
      .filter(({ type }) => type === "setting");
    if (!positionalSettings.length) {
      console.log(t);
      throw new Error("NO POSITIONAL SETTINGS");
    }
    const values = positionalSettings[0].values;
    if (values.length > 1) {
      throw new Error("Single value expected");
    }
    const langName = values[0].raw;
    return langName;
  } catch (e) {
    console.log("TEMP LANGUAGE NAME ERROR:", e);
    return NO_LANGUAGE;
  }
}
