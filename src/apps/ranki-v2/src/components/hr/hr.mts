import "./hr.css";

export function createHr(attach: HTMLElement) {
  const container = document.createElement("ranki-hr");
  container.classList.add("container");
  const hr = document.createElement("ranki-hr");
  hr.classList.add("hr");
  container.appendChild(hr);
  attach.appendChild(container);
}
