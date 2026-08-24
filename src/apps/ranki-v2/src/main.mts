import { WITH_DEV_TOOLS, WITH_O11Y } from "./variant.constants.mjs";

if (
  import.meta.env.MODE === WITH_DEV_TOOLS ||
  import.meta.env.MODE === WITH_O11Y
) {
  await import("./o11y/o11y.mjs");
}

await import("./core.mjs");

// import "./o11y/o11y.mjs";
// import "./core.mjs";
