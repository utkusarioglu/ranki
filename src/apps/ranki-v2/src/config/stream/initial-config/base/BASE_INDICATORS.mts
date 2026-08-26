import type {
  RankiIndicatorDefinition,
  RankiIndicatorName,
} from "_config/config.types.mjs";

export const BASE_INDICATORS: RankiIndicatorDefinition[] = [
  {
    name: "red-arch" as RankiIndicatorName,
    style:
      "radial-gradient(150% 107% at bottom center, transparent 90%, rgb(var(--scheme-red-2)))",
  },
  {
    name: "caution" as RankiIndicatorName,
    style: "linear-gradient(44deg, rgb(var(--scheme-red-0)), transparent)",
  },
  {
    name: "clown-college" as RankiIndicatorName,
    style:
      "conic-gradient(from 31deg at 80% 65%, rgb(var(--scheme-red-1)) 121deg, rgb(var(--scheme-blue-1)) 0% 50%, rgb(var(--scheme-green-1)) 0% calc(180deg + 121deg), rgb(var(--scheme-purple-1)) 0%)",
  },
  {
    name: "colorful" as RankiIndicatorName,
    style: `
radial-gradient(
  120% 120% at 12% 18%,
  rgb(var(--scheme-red-1)) 0%,
  transparent 52%
),
radial-gradient(
  110% 110% at 88% 82%,
  rgb(var(--scheme-orange-1)) 0%,
  transparent 58%
),
linear-gradient(
  135deg,
  transparent 0%,
  rgb(var(--scheme-green-1)) 33%,
  transparent 66%
),
linear-gradient(
  315deg,
  transparent 0%,
  rgb(var(--scheme-blue-1)) 38%,
  transparent 72%
),
repeating-linear-gradient(
  0deg,
  transparent 0px,
  transparent 22px,
  rgb(var(--scheme-purple-1)) 23px,
  transparent 26px
)
`
      .replace(/\s+/g, " ")
      .trim(),
  },
  {
    name: "checkered" as RankiIndicatorName,
    style: `repeating-conic-gradient(rgb(var(--scheme-blue-2)) 0 25%, transparent 0 50%) 50% / 15vmin 15vmax`,
  },
];
