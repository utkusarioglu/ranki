import type { NodeArgsBaseV2 } from "@ranki/plugin-parser-base-v2";
import type {
  ParamsV2SpecNone,
  ParamsV2SpecPopulated,
  ArgsAndParamsV2,
} from "@ranki/plugin-grammar-params-v2";
import type { AstNode, ComponentChain } from "@ranki/package-api-v2";
import type { OmittedType } from "./common.mjs";

interface Common {
  parent: AstNode;
  chainList: ComponentChain[];
}

export interface NodeArgsFrameV2ConfigFp_F extends Common {
  type: "RankiFrameV2";
  version: "v2";
  variant: "fp_F"; // this is like f fp
  // chain: ComponentChain;
  shape: NodeArgsBaseV2;
  params: ParamsV2SpecPopulated;
  subtree: {
    paramsContainer: {
      shape: ArgsAndParamsV2["shape"];
    };
  };
}

export interface NodeArgsFrameV2ConfigFp_f extends Common {
  type: "RankiFrameV2";
  version: "v2";
  variant: "fp_f"; // this is like f fp
  // chain: ComponentChain;
  shape: NodeArgsBaseV2;
  params: ParamsV2SpecPopulated;
  subtree: {
    paramsContainer: {
      shape: ArgsAndParamsV2["shape"];
    };
  };
}

export interface NodeArgsFrameV2ConfigP extends Common {
  type: "RankiFrameV2";
  version: "v2";
  variant: "p"; // this is like f fp
  shape: NodeArgsBaseV2;
  params: ParamsV2SpecNone;
  subtree: {};
}

export interface NodeArgsFrameV2ConfigE extends Common {
  type: "RankiFrameV2";
  version: "v2";
  variant: "e"; // this is like f fp
  // chainList: ComponentChain[];
  shape: NodeArgsBaseV2;
  params: ParamsV2SpecNone;
  subtree: {};
}

export type NodeArgsFrameV2 =
  | NodeArgsFrameV2ConfigE
  | NodeArgsFrameV2ConfigP
  | NodeArgsFrameV2ConfigFp_F
  | NodeArgsFrameV2ConfigFp_f;

export type NodeArgsFrameV2Config =
  | NodeArgsFrameV2ConfigFp_F
  | NodeArgsFrameV2ConfigFp_f
  | NodeArgsFrameV2ConfigP
  | NodeArgsFrameV2ConfigE;

export type NodeArgsFrameV2ConfigReduced =
  | NodeArgsFrameV2ConfigFp_F_Reduced
  | NodeArgsFrameV2ConfigFp_f_Reduced
  | NodeArgsFrameV2ConfigP_Reduced
  | NodeArgsFrameV2ConfigE_Reduced;

export type NodeArgsFrameV2ConfigFp_F_Reduced =
  OmittedType<NodeArgsFrameV2ConfigFp_F>;

export type NodeArgsFrameV2ConfigFp_f_Reduced =
  OmittedType<NodeArgsFrameV2ConfigFp_f>;

export type NodeArgsFrameV2ConfigP_Reduced =
  OmittedType<NodeArgsFrameV2ConfigP>;

export type NodeArgsFrameV2ConfigE_Reduced =
  OmittedType<NodeArgsFrameV2ConfigE>;
