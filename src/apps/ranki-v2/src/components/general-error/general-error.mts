import { RankiAppError } from "../../error/ranki-app-error.mts";
import { createVerticalScroller } from "../vertical-scroller/vertical-scroller.mts";
import yaml from "yaml";
import {
  RENDERED_CLASS_SELECTOR,
  ROOT_ID_SELECTOR,
} from "../../selector.constants.mts";

const COLOR_CRIMSON = "#550000";
const COLOR_GRAY = "#aaa";
const COLOR_BLACK = "#000";

export function createAppErrorScreen(
  attach: HTMLElement,
  error: unknown,
): void {
  attach.style.backgroundColor = COLOR_BLACK;

  attach.innerText = "";
  const container = document.createElement("div");
  container.id = ROOT_ID_SELECTOR;
  container.classList.add(RENDERED_CLASS_SELECTOR);
  container.classList.add("ranki-v2-general-error");
  container.style.marginInline = "auto";
  container.style.width = "450px";
  const scroller = createVerticalScroller(attach);
  scroller.element.appendChild(container);
  const h1 = document.createElement("h1");
  h1.innerText = "Error";
  h1.style.color = COLOR_CRIMSON;
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
  p.style.color = COLOR_CRIMSON;
  p.innerText = errObject.hasOwnProperty("why")
    ? errObject.why
    : "Something went wrong";
  container.appendChild(h1);
  container.appendChild(p);
  const pre = document.createElement("pre");
  container.appendChild(pre);
  pre.style.color = COLOR_GRAY;
  const obj = errObject.toExtendedJSON();

  try {
    pre.innerHTML = yaml.stringify(obj);
  } catch (e) {
    pre.innerHTML = JSON.stringify(obj, null, 2);
  }
}
