import "./hr.css";

export function createHr(attach: HTMLElement, index: number) {
  const NAME = "ranki-hr";
  const CONTAINER = "container";
  const indexClass = "index-" + index.toString();
  const h = attach.querySelector(`${NAME}.${CONTAINER} ${indexClass}`);
  if (h) {
    return;
  }
  const container = document.createElement(NAME);
  container.classList.add(CONTAINER, indexClass);
  const hr = document.createElement(NAME);
  hr.classList.add("hr");
  container.appendChild(hr);
  attach.appendChild(container);
}
