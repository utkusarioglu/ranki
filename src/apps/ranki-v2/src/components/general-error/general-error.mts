import { RankiAppError } from "_error/ranki-app-error.mts";
import yaml from "yaml";
import { ERROR_ID_SELECTOR } from "../../selector.constants.mts";

const COLOR_CRIMSON = "#550000";
const COLOR_GRAY = "#aaa";
const COLOR_BLACK = "#000";

export function createAppErrorScreen(
  attach: HTMLElement,
  error: unknown,
): void {
  attach.style.backgroundColor = COLOR_BLACK;

  const container = document.createElement("div");
  attach.append(container);
  container.id = ERROR_ID_SELECTOR.slice(1);
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.marginInline = "auto";
  container.style.padding = "1em";
  container.style.background = "black";
  const h1 = document.createElement("h1");
  h1.innerText = "Error";
  h1.style.color = COLOR_CRIMSON;
  let errObject: RankiAppError;
  if (typeof (error as any).toExtendedJSON === "function") {
    errObject = error as any;
  } else {
    errObject = new RankiAppError({
      code: "UNEXPECTED_ERROR",
      why: "Unforeseen failure mode",
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
  pre.style.overflowX = "auto";
  pre.style.paddingBottom = "1em";
  container.appendChild(pre);
  pre.style.color = COLOR_GRAY;
  const obj = errObject.toExtendedJSON();

  try {
    pre.innerHTML = yaml.stringify(obj);
  } catch (e) {
    pre.innerHTML = JSON.stringify(obj, null, 2);
  }
}
