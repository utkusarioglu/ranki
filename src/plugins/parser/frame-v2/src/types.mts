import type { NodeArgs as NodeArgsBaseV2 } from "@ranki/package-api";
import type { ParamsV2Spec } from "@ranki/plugin-parser-params-v2";

export type FrameV2Config =
  | FrameV2ConfigFp_F
  | FrameV2ConfigFp_f
  | FrameV2ConfigP;

export interface FrameV2ConfigFp_F {
  "frame.v2": {
    type: string;
    variant: "fp_F"; // this is like f fp
    frameType: string; // like code in %:code; ...:%
    args: NodeArgsBaseV2 & {
      "separator.right.type": string;
      // !FIX this value is inside the config structure, which breaks symmetry
      // "separator.left.type": string;
      "frame.v2.config": NodeArgsBaseV2;
    };
    params: ParamsV2Spec;
  };
}

export interface FrameV2ConfigFp_f {
  "frame.v2": {
    type: string;
    variant: "fp_f"; // this is like f fp
    frameType: string; // like code in %:code; ...:%
    args: NodeArgsBaseV2 & {
      "separator.right.type": string;
      // !FIX this value is inside the config structure, which breaks symmetry
      // "separator.left.type": string;
      "frame.v2.config": NodeArgsBaseV2;
    };
    params: ParamsV2Spec;
  };
}

export interface FrameV2ConfigP {
  "frame.v2": {
    type: string;
    variant: "p"; // this is like f fp
    frameType: string; // like code in %:code; ...:%
    args: NodeArgsBaseV2 & {
      "separator.right.type": string;
    };
  };
}

export interface DirectiveV2Config {
  "directive.v2": {
    type: string;
    args: NodeArgsBaseV2;
    params: ParamsV2Spec;
  };
}
