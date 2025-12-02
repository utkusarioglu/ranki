import type { IDqmPlugin } from "@dqm/package-dqm-api-v2";
import { frameV2Container } from "./components/component-set.mjs";
import { frameV2Grammar } from "./parsers/frame-v2/frame-v2.mjs";

const frameV2: IDqmPlugin = [frameV2Container, frameV2Grammar];

export default frameV2;
