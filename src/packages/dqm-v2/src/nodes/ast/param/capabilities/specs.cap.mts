import type { ChannelParamSpecs } from "@dqm/package-dqm-api-v2";
import { assertExists } from "@dqm/package-dqm-utils";

export function paramSpecsCapability<T>(self: T) {
  let specs: ChannelParamSpecs;

  return {
    setSpecs(s: ChannelParamSpecs): T {
      specs = s;
      return self;
    },

    getSpecs(): ChannelParamSpecs {
      assertExists(specs, {
        why: "Asking for specs when it's not defined indicates an architectural issue",
      });
      return specs;
    },
  };
}
