import { RankiAppError } from "_error/ranki-app-error.mts";
import yaml from "yaml";
import style from "./big-error.component.css?inline";
import { Wc } from "_components/wc/wc.mjs";

export class RBigError extends Wc<Error> {
  public static readonly tag = "r-big-error" as const;

  constructor() {
    super(true);
    this.css.pushStyles(style);
  }

  initialize() {
    const h1 = this.elements.create("heading", { tag: "h1" });
    h1.innerText = "Error";
    this.elements.create("description", { tag: "p" });
    this.elements.create("output", { tag: "pre" });
  }

  protected onStateChange(curr: Error): void {
    const description = this.elements.get("description")!;
    const output = this.elements.get("output")!;

    let errObject: RankiAppError;
    if (typeof (curr as any).toExtendedJSON === "function") {
      errObject = curr as any;
    } else {
      errObject = new RankiAppError({
        code: "UNEXPECTED_ERROR",
        why: "Unforeseen failure mode",
        cause: curr,
      });
    }
    description.innerText = errObject.hasOwnProperty("why")
      ? errObject.why
      : "Something went wrong";

    const obj = errObject.toExtendedJSON();
    try {
      output.innerHTML = yaml.stringify(obj);
    } catch (e) {
      output.innerHTML = JSON.stringify(obj, null, 2);
    }
  }

  static remove() {
    const err = document.querySelector(RBigError.tag);
    if (err) err.parentElement?.removeChild(err);
  }
}
