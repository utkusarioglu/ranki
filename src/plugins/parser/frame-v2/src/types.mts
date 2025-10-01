// import type { NodeArgs as NodeArgsBaseV2 } from "@ranki/package-api";
import type { ParamsV2Spec } from "@ranki/plugin-parser-params-v2";
import type { NodeArgsBaseV2 } from "@ranki/plugin-parser-base-v2";
import { AstNode } from "@ranki/package-api";

export type NodeArgsFrameV2Config =
  | NodeArgsFrameV2ConfigFp_F
  | NodeArgsFrameV2ConfigFp_f
  | NodeArgsFrameV2ConfigP;

export type ParseNodeFrameV2 =
  | ParseNodeFrameV2Fp_F
  | ParseNodeFrameV2Fp_f
  | ParseNodeFrameV2P;

export type ParseNodeFrameV2Fp_F = Omit<AstNode, "args"> & {
  args: NodeArgsFrameV2ConfigFp_F;
};
export type ParseNodeFrameV2Fp_f = Omit<AstNode, "args"> & {
  args: NodeArgsFrameV2ConfigFp_f;
};
export type ParseNodeFrameV2P = Omit<AstNode, "args"> & {
  args: NodeArgsFrameV2ConfigP;
};

export interface NodeArgsFrameV2ConfigFp_F {
  "frame.v2": {
    type: string;
    variant: "fp_F"; // this is like f fp
    frameType: string; // like code in %:code; ...:%
    args: Partial<NodeArgsBaseV2> & {
      "separator.right.type": string;
      // !FIX this value is inside the config structure, which breaks symmetry
      // "separator.left.type": string;
      "frame.v2.config": Partial<NodeArgsBaseV2>;
    };
    params: ParamsV2Spec;
  };
}

export interface NodeArgsFrameV2ConfigFp_f {
  "frame.v2": {
    type: string;
    variant: "fp_f"; // this is like f fp
    frameType: string; // like code in %:code; ...:%
    args: Partial<NodeArgsBaseV2> & {
      "separator.right.type": string;
      // !FIX this value is inside the config structure, which breaks symmetry
      // "separator.left.type": string;
      "frame.v2.config": Partial<NodeArgsBaseV2>;
    };
    params: ParamsV2Spec;
  };
}

export interface NodeArgsFrameV2ConfigP {
  "frame.v2": {
    type: string;
    variant: "p"; // this is like f fp
    frameType: string; // like code in %:code; ...:%
    args: Partial<NodeArgsBaseV2> & {
      "separator.right.type": string;
    };
  };
}

export interface NodeArgsDirectiveV2Config {
  "directive.v2": {
    type: string;
    args: Partial<NodeArgsBaseV2>;
    params: ParamsV2Spec;
  };
}

export type NodeArgsFrameV2 =
  | NodeArgsFrameV2D
  | NodeArgsFrameV2F
  | NodeArgsFrameV2Fp_F
  | NodeArgsFrameV2Fp_f;

export type NodeArgsFrameV2D = Partial<NodeArgsBaseV2> &
  NodeArgsDirectiveV2Config;

export type NodeArgsFrameV2F = Partial<NodeArgsBaseV2> & NodeArgsFrameV2ConfigP;

export type NodeArgsFrameV2Fp_F = Partial<NodeArgsBaseV2> &
  NodeArgsFrameV2ConfigFp_F;
export type NodeArgsFrameV2Fp_f = Partial<NodeArgsBaseV2> &
  NodeArgsFrameV2ConfigFp_f;

export interface ArgsAndParamsV2FrameV2 {
  args: NodeArgsFrameV2;
  params: ParamsV2Spec;
}
