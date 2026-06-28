import "_components/registry.mjs";

window.addEventListener("error", (e) => {
  e.preventDefault();
  console.error(e);
});

window.addEventListener("unhandledrejection", (e) => {
  e.preventDefault();
  console.error(e.reason.toExtendedJSON());
});

if (!document.querySelector("r2-app")) {
  document.body.appendChild(document.createElement("r2-app"));
}
