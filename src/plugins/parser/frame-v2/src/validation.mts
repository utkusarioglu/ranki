import type {
  RankiPluginParserValidationCallback,
  RankiPluginParserValidationFunc,
  // RankiPluginParserValidationDictionary
} from "@ranki/package-api-v2";

const placeholder: RankiPluginParserValidationFunc = (n) => ({
  warnings: [["Placeholder:", n.kind, n.type].join(" ")],
  errors: [],
});

export const validations: RankiPluginParserValidationCallback = () => ({
  block_v2: placeholder,
  v2_e: placeholder,
  v2_f: placeholder,
  v2_fp: placeholder,
  v2Payload_p: placeholder,
  v2Payload_P: placeholder,
  pauseList: placeholder,
  v2PayloadSection: placeholder,
  v2PayloadPlain: placeholder,
  pausedContainer: placeholder,
});
