import "./general-error.css";
import { RankiAppError } from "../../error/ranki-app-error.mts";
import { createVerticalScroller } from "../vertical-scroller/vertical-scroller.mts";
import yaml from "yaml";

export function createAppErrorScreen(
  attach: HTMLElement,
  error: unknown,
): void {
  attach.innerText = "";
  const scroller = createVerticalScroller(attach);
  const container = document.createElement("div");
  scroller.element.appendChild(container);
  container.classList.add("ranki-v2-general-error");
  container.style.width = "var(--content-width)";
  const h1 = document.createElement("h1");
  h1.innerText = "Error";
  let errObject: RankiAppError;
  if (typeof (error as any).toExtendedJSON === "function") {
    errObject = error as any;
  } else {
    errObject = new RankiAppError({
      code: "UNEXPECTED_ERROR",
      why: "Unforeseen failure",
      cause: error,
    });
  }

  const p = document.createElement("p");
  p.innerText = errObject.hasOwnProperty("why")
    ? errObject.why
    : "Something went wrong";
  container.appendChild(h1);
  container.appendChild(p);
  const pre = document.createElement("pre");
  container.appendChild(pre);
  const obj = errObject.toExtendedJSON();

  try {
    pre.innerHTML = yaml.stringify(obj);
  } catch (e) {
    pre.innerHTML = JSON.stringify(obj, null, 2);
  }
}
