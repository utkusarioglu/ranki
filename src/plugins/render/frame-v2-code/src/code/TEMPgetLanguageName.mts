import type { TransformNode } from "@ranki/package-api-v2";

export function TEMPgetLanguageName(t: TransformNode) {
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
}
