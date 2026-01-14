import "./general-error.css";
import type { RankiComponent } from "../../types/ranki-component.types.mjs";

export function createAppErrorScreen(error: unknown): RankiComponent {
  const container = document.createElement("div");
  container.classList.add("ranki-v2-general-error");
  container.style.width = "var(--content-width)";
  const h1 = document.createElement("h1");
  h1.innerText = "Error";
  const errObject = (error as any).toExtendedJSON();
  const p = document.createElement("p");
  p.innerText = errObject.hasOwnProperty("why")
    ? errObject.why
    : "Something went wrong";
  container.appendChild(h1);
  container.appendChild(p);
  const pre = document.createElement("pre");
  container.appendChild(pre);
  pre.innerHTML = JSON.stringify(errObject, null, 2);

  return {
    element: container,
  };
}
