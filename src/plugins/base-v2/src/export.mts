import type { IDqmPlugin } from "@dqm/package-dqm-api-v2";
import { constantsV2Grammar } from "./parsers/constants-v2/constants-v2.mjs";
import { baseV2Grammar } from "./parsers/base-v2/base-v2.mjs";
import { baseV2Components } from "./components/component-set.mjs";
import { baseV2Renderer } from "./renderers/default/default.ren.mjs";

const baseV2: IDqmPlugin = [
  constantsV2Grammar,
  baseV2Grammar,
  baseV2Components,
  baseV2Renderer,
];

export default baseV2;
