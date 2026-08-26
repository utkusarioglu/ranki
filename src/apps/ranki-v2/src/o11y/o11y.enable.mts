import { Collect } from "_collect/collect.mjs";

import { DEFAULT_O11Y } from "./config-default.mjs";
import { RankiO11y } from "./o11y.mjs";

const collected = Collect.o11y();
switch (collected.type) {
  case "custom":
    RankiO11y.enable(collected.config);
    break;
  case "default":
    RankiO11y.enable(DEFAULT_O11Y);
    break;
}
