import type { IDqmPlugin } from "@ranki/package-dqm-api-v2";
import { constantsV2Grammar } from "./parsers/constants-v2/constants-v2.mjs";
import { baseV2Grammar } from "./parsers/base-v2/base-v2.mjs";
import { baseV2Components } from "./components/component-set.mjs";

const baseV2: IDqmPlugin = [
  constantsV2Grammar,
  baseV2Grammar,
  baseV2Components,
];

export default baseV2;
