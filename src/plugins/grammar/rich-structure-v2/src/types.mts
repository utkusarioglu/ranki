// import type { NodeArgs as NodeArgsBaseV2 } from "@ranki/package-api-v2";
import type { ParamsV2Spec } from "@ranki/plugin-grammar-params-v2";
import type { NodeArgsBaseV2 } from "@ranki/plugin-parser-base-v2";
import type { AstNode } from "@ranki/package-api-v2";

export interface NodeArgsRichStructureV2 {
  "richStructure.v2": {
    // name: string;
    // type: "implicit" | "explicit";
    args: AstNode["args"] &
      Partial<NodeArgsBaseV2> & {
        "richStructure.v2.config": Partial<NodeArgsBaseV2>;
      };
    params: ParamsV2Spec;
  };
}

export type ParseNodeRichStructureV2 = Omit<AstNode, "args"> & {
  args: AstNode["args"] & Partial<NodeArgsBaseV2> & NodeArgsRichStructureV2;
};

export interface ArgsAndParamsV2RichStructureV2 {
  args: NodeArgsRichStructureV2;
  params: ParamsV2Spec;
}
