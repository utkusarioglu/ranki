import { RankiAppError } from "_error/ranki-app-error.mts";
import yaml from "yaml";
import { RankiWc } from "_components/ranki-wc/ranki-wc.mjs";
import style from "./big-error.component.css?inline";

export class RankiBigError extends RankiWc<Error> {
  public static name = "ranki-big-error" as const;

  constructor() {
    super(true);
    this.pushStyles(style);
  }

  render(): this {
    const error = this.getCurr();

    const h1 = document.createElement("h1");
    h1.innerText = "Error";

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

    p.innerText = errObject.hasOwnProperty("why")
      ? errObject.why
      : "Something went wrong";
    const pre = document.createElement("pre");
    const obj = errObject.toExtendedJSON();

    [h1, p, pre].forEach((e) => {
      this.shadowRoot!.appendChild(e);
    });

    try {
      pre.innerHTML = yaml.stringify(obj);
    } catch (e) {
      pre.innerHTML = JSON.stringify(obj, null, 2);
    }
    return this;
  }

  static clear() {
    const err = document.querySelector(RankiBigError.name);
    if (err) {
      err.parentElement?.removeChild(err);
    }
  }
}
