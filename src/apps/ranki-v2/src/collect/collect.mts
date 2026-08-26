import { O11Y_CLASS_SELECTOR } from "_/selector.constants.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";

import { CollectTemplate } from "./template.mjs";

export class Collect {
  public static o11y() {
    const elem = document.querySelector(O11Y_CLASS_SELECTOR);
    if (!elem) return { type: "disabled" };
    const raw = elem.textContent;

    try {
      const parsed = JSON.parse(raw);
      return {
        config: parsed,
        type: "custom",
      };
    } catch (e) {
      if (raw.length === 0 || raw.toUpperCase() === "DEFAULT") {
        return { type: "default" };
      } else {
        throw new RankiAppError({
          cause: e,
          code: "INVALID_TYPE",
          details: { raw },
          why: "observability input type needs to be valid json",
        });
      }
    }
  }

  public static template() {
    return CollectTemplate.all();
  }
}
