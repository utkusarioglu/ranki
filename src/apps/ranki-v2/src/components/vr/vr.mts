import "./vr.css";

export function createVr(attach: HTMLElement, index: number) {
  const NAME = "ranki-vr";
  const CONTAINER = "container";
  const indexClass = "index-" + index.toString();
  const d = attach.querySelector(`${NAME}.${CONTAINER} ${indexClass}`);
  if (d) {
    return d;
  }

  const container = document.createElement(NAME);
  container.classList.add(CONTAINER, indexClass);
  const vr = document.createElement(NAME);
  vr.classList.add("vr");
  container.appendChild(vr);
  attach.appendChild(container);
}
