import { vi } from "vitest";

vi.mock("../o11y.mts", async () => import("./o11y.mock.mjs"));
