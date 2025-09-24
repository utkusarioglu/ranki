import type { NodeArgs as NodeArgsBaseV2 } from "@ranki/package-api";
import type { ParamsV2Spec } from "@ranki/plugin-parser-params-v2";

export interface RichStructureV1 {
  "richStructure.v1": {
    // name: string;
    // type: "implicit" | "explicit";
    args: NodeArgsBaseV2 & {
      "richStructure.v1.config": NodeArgsBaseV2;
    };
    params: ParamsV2Spec;
  };
}
