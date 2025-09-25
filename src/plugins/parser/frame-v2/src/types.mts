// import type { NodeArgs as NodeArgsBaseV2 } from "@ranki/package-api";
import type { ParamsV2Spec } from "@ranki/plugin-parser-params-v2";
import type { NodeArgsBaseV2 } from "@ranki/plugin-parser-base-v2";
import { ParseNode } from "@ranki/package-api";

export type FrameV2Config =
  | FrameV2ConfigFp_F
  | FrameV2ConfigFp_f
  | FrameV2ConfigP;

export type ParseNodeFrameV2 =
  | ParseNodeFrameV2Fp_F
  | ParseNodeFrameV2Fp_f
  | ParseNodeFrameV2P;

export type ParseNodeFrameV2Fp_F = Omit<ParseNode, "args"> & {
  args: FrameV2ConfigFp_F;
};
export type ParseNodeFrameV2Fp_f = Omit<ParseNode, "args"> & {
  args: FrameV2ConfigFp_f;
};
export type ParseNodeFrameV2P = Omit<ParseNode, "args"> & {
  args: FrameV2ConfigP;
};

export interface FrameV2ConfigFp_F {
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

export interface FrameV2ConfigFp_f {
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

export interface FrameV2ConfigP {
  "frame.v2": {
    type: string;
    variant: "p"; // this is like f fp
    frameType: string; // like code in %:code; ...:%
    args: Partial<NodeArgsBaseV2> & {
      "separator.right.type": string;
    };
  };
}

export interface DirectiveV2Config {
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

export type NodeArgsFrameV2D = Partial<NodeArgsBaseV2> & DirectiveV2Config;

export type NodeArgsFrameV2F = Partial<NodeArgsBaseV2> & FrameV2ConfigP;

export type NodeArgsFrameV2Fp_F = Partial<NodeArgsBaseV2> & FrameV2ConfigFp_F;
export type NodeArgsFrameV2Fp_f = Partial<NodeArgsBaseV2> & FrameV2ConfigFp_f;

export interface ArgsAndParamsV2FrameV2 {
  args: NodeArgsFrameV2;
  params: ParamsV2Spec;
}
