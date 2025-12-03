import type { IDqmPluginComponentSet } from "@dqm/package-dqm-api-v2";
import { frameV2ContainerComponent } from "./container/container.mjs";

export const frameV2Container: IDqmPluginComponentSet = {
  type: "component-set",
  meta: {
    name: "FrameV2:Container",
    version: "0.0.0",
    description: "Provides the container component for every FrameV2 plugin",
  },
  list: [frameV2ContainerComponent],
};
