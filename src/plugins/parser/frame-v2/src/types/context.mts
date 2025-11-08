import type { ComponentChainString } from "@ranki/package-api-v2";
import type { ParamsV2Spec } from "@ranki/plugin-grammar-params-v2";

export interface RankiLangParserPluginParseHandlerFrameV2 {
  type: "RankiFrameV2";
  version: "v2";
  chainList: ComponentChainString[];
  variant: string; // this is like f fp
  params: ParamsV2Spec; // ParamsV2Spec;
}
