import type {
  RankiFace,
  RankiContentType,
} from "_stores/anki-dist/anki.store.types.mjs";
import type { Flag } from "./AnkiRenderSettings.types.mts";

export const FLAGS: Flag[] = [
  {
    color: "none",
    flag: "flag0",
  },
  {
    color: "#FF0000",
    flag: "flag1",
  },
  {
    color: "#FF7700",
    flag: "flag2",
  },
  {
    color: "#00FF00",
    flag: "flag3",
  },
  {
    color: "#0000FF",
    flag: "flag4",
  },
  {
    color: "#e89eb8",
    flag: "flag5",
  },
  {
    color: "#40E0D0",
    flag: "flag6",
  },
  {
    color: "#BF40BF",
    flag: "flag7",
  },
];

export const FACES: RankiFace[] = ["Q", "N"];

export const OVERRIDES = [
  {
    mode: "passthru" as const,
    title: "Passthru",
  },
  {
    mode: "autoSucceed" as const,
    title: "Succeed",
  },
  {
    mode: "autoFail" as const,
    title: "Fail",
  },
  {
    mode: "autoThrow" as const,
    title: "Throw",
  },
];

export const CONTENT_TYPES = [
  {
    contentType: "r2" as RankiContentType,
    title: "Dqm",
  },
  {
    contentType: "foreign" as RankiContentType,
    title: "Foreign",
  },
];

export const APP_VARIANTS = [
  {
    title: "Core",
    variant: "core" as const,
  },
  {
    title: "Observable",
    variant: "o11y" as const,
  },
  {
    title: "Devtools",
    variant: "devtools" as const,
  },
];
