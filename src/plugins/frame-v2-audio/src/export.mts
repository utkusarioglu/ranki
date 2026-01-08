import type { IDqmPlugin } from "@dqm/package-dqm-api-v2";
import { renderer } from "./renderers/renderers.mjs";
import { frameV2Tones } from "./components/component-set.mjs";

const frameV2: IDqmPlugin = [frameV2Tones, renderer];

export default frameV2;
