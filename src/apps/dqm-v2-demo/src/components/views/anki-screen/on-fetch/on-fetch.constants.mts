import type { FetchRule } from "./on-fetch.types.mts";

export const FETCH_RULES: FetchRule[] = [
  {
    title: "Telemetry",
    type: "telemetry" as const,
    test: (u) => ["8080", "file-batch"].some((v) => u.toString().includes(v)),
  },
];
