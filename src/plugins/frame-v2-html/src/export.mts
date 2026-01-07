import type { IDqmPlugin } from "@dqm/package-dqm-api-v2";
import { frameV2Html } from "./components/component-set.mjs";
import { htmlPrimitivesRenderer } from "./renderers/html-primitives/html-primitives.ren.mjs";

const frameV2: IDqmPlugin = [frameV2Html, htmlPrimitivesRenderer];

export default frameV2;
