import type { IDqmPlugin } from "@dqm/package-dqm-api-v2";
import { paramsV2Grammar } from "./parsers/params-v2/params-v2.mjs";

const paramsV2: IDqmPlugin = [paramsV2Grammar];

export default paramsV2;
