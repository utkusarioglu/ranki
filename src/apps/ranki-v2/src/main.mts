async function main() {
  await import("./error/listeners.mjs");
  await import("./config.mjs");
  await import("_components/registry.mjs");
  if (!document.querySelector("r2-app")) {
    document.body.appendChild(document.createElement("r2-app"));
  }
}

if (import.meta.env.MODE === "development") {
  await import("./o11y/o11y.mjs");
  await main();
} else {
  main();
}

// if (import.meta.env.MODE === "development") {
//   await import("./o11y/o11y.mjs");
// }
// import "./o11y/o11y.mjs";
// import "./error/listeners.mjs";
// import "./config.mjs";
// import "_components/registry.mjs";

// if (!document.querySelector("r2-app")) {
//   document.body.appendChild(document.createElement("r2-app"));
// }
