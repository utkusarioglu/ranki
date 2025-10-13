import type { RankiPluginParserTransformCallback } from "@ranki/package-api-v2";
import { transformPlaceholder as placeholder } from "@ranki/package-api-v2/helpers";

export const transformers: RankiPluginParserTransformCallback = () => ({
  block_v2: placeholder,
  v2_e: placeholder,
  v2_f: placeholder,
  v2_fp: placeholder,
  v2Payload_p: placeholder,
  pauseList: placeholder,
  v2PayloadSection: placeholder,
  v2PayloadPlain: placeholder,
  pausedContainer: placeholder,
  v2Payload_P: placeholder,
});
