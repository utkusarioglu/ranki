import type { AnkiFlagColors } from "./config.types.mts";

export const FLAG_COLOR_ORDER: AnkiFlagColors[] = [
  "none",
  "red",
  "orange",
  "green",
  "blue",
  "pink",
  "turquoise",
  "purple",
];

// ...Object.fromEntries(
//   FLAG_COLOR_ORDER.filter((v) => v !== "none").map((color) => [
//     color,
//     {
//       indicator: "none" as RankiIndicatorName,
//       background: {
//         color: `${color}-2`,
//       },
//       message: {
//         text: "",
//         color: "tone-0",
//       },
//     },
//   ]),
// ),
