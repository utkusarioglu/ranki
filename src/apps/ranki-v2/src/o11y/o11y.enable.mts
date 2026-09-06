import { Collect } from "_collect/collect.mjs";
import { store } from "_store/store.mjs";

import { DEFAULT_O11Y } from "./config-default.mjs";
import { RankiO11y } from "./o11y.mjs";

const collected = Collect.o11y();
switch (collected.type) {
  case "custom":
    store.pushNotification({
      group: "o11y-enabled",
      icon: "boxicons:8-ball",
      log: "Ranki Observability enabled with custom settings",
    });
    RankiO11y.enable(collected.config);
    break;
  case "default":
    store.pushNotification({
      group: "o11y-enabled",
      icon: "boxicons:8-ball-filled",
      log: "Ranki Observability enabled with default settings",
    });
    RankiO11y.enable(DEFAULT_O11Y);
    break;
}
