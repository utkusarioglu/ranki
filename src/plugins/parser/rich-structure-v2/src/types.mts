// import type { NodeArgs as NodeArgsBaseV2 } from "@ranki/package-api";
import type { ParamsV2Spec } from "@ranki/plugin-parser-params-v2";
import type { NodeArgsBaseV2 } from "@ranki/plugin-parser-base-v2";
import type { ParseNode } from "@ranki/package-api";

export interface NodeArgsRichStructureV2 {
  "richStructure.v2": {
    // name: string;
    // type: "implicit" | "explicit";
    args: Partial<NodeArgsBaseV2> & {
      "richStructure.v2.config": Partial<NodeArgsBaseV2>;
    };
    params: ParamsV2Spec;
  };
}

export type ParseNodeRichStructureV2 = Omit<ParseNode, "args"> & {
  args: Partial<NodeArgsBaseV2> & NodeArgsRichStructureV2;
};

export interface ArgsAndParamsV2RichStructureV2 {
  args: NodeArgsRichStructureV2;
  params: ParamsV2Spec;
}
