import type { IDqmPlugin } from "@dqm/package-dqm-api-v2";
import { frameV2Debug } from "./components/component-set.mjs";

const frameV2: IDqmPlugin = [frameV2Debug];

export default frameV2;
