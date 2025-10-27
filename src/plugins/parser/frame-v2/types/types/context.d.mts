import type { ParamsV2Spec } from "@ranki/plugin-grammar-params-v2";
import type { FrameSpec } from "./args.mjs";
export interface RankiLangParserPluginParseHandlerFrameV2 {
    type: "RankiFrameV2";
    version: "v2";
    chain: FrameSpec[];
    variant: string;
    params: ParamsV2Spec;
}
