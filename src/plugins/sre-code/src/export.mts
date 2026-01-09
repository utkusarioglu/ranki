import type { IDqmPlugin } from "@dqm/package-dqm-api-v2";
import { renderer } from "./renderers/renderers.mjs";

const frameV2: IDqmPlugin = [renderer];

export default frameV2;
