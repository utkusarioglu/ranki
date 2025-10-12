import type { ParamsV2Spec } from "@ranki/plugin-parser-params-v2";
import type { NodeArgsBaseV2 } from "@ranki/plugin-parser-base-v2";
import type { AstNode } from "@ranki/package-api-v2";
import { Single } from "./main.mjs";

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

export type FrameSpec = string[];

type WithFrameChain = { chain: FrameSpec[] };

export interface NodeArgsFrameV2ConfigFp_F {
  frame: WithFrameChain & {
    version: "v2";
    variant: "fp_F"; // this is like f fp
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
  frame: WithFrameChain & {
    version: "v2";
    variant: "fp_f"; // this is like f fp
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
  frame: WithFrameChain & {
    version: "v2";
    variant: "p"; // this is like f fp
    args: Partial<NodeArgsBaseV2> & {
      "separator.right.type": string;
    };
  };
}

export interface NodeArgsFrameV2ConfigE {
  frame: WithFrameChain & {
    version: "v2";
    variant: "e"; // this is like f fp
    // type: string;
    args: Partial<NodeArgsBaseV2>;
  };
}

export type NodeArgsFrameV2 =
  | NodeArgsFrameV2E
  | NodeArgsFrameV2F
  | NodeArgsFrameV2Fp_F
  | NodeArgsFrameV2Fp_f;

export type NodeArgsFrameV2F = Partial<NodeArgsBaseV2> & NodeArgsFrameV2ConfigP;

export type NodeArgsFrameV2E = Partial<NodeArgsBaseV2> & NodeArgsFrameV2ConfigE;

export type NodeArgsFrameV2Fp_F = Partial<NodeArgsBaseV2> &
  NodeArgsFrameV2ConfigFp_F;
export type NodeArgsFrameV2Fp_f = Partial<NodeArgsBaseV2> &
  NodeArgsFrameV2ConfigFp_f;

export interface ArgsAndParamsV2FrameV2 {
  args: NodeArgsFrameV2;
  params: ParamsV2Spec;
}
export interface RankiLangParserPluginParseHandlerFrameV2 {
  type: "RankiFrameV2";
  chain: string[][];
  variant: "fp_F"; // this is like f fp
  params: ParamsV2Spec; // ParamsV2Spec;
}
export interface RankiFrameV2ParserPluginConfig {
  tokens: {
    pause: Single;
    left: {
      outer: Single;
      inner: Single;
    };
    right: {
      outer: Single;
      inner: Single;
    };
    separator: {
      param: Single;
    };
  };
}
