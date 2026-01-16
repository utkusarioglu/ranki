import "./vr.css";

export function createVr(attach: HTMLElement) {
  const container = document.createElement("ranki-vr");
  container.classList.add("container");
  const vr = document.createElement("ranki-vr");
  vr.classList.add("vr");
  container.appendChild(vr);
  attach.appendChild(container);
}
