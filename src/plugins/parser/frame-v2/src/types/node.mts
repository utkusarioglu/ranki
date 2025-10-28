import type { AstNodeParent } from "@ranki/package-api-v2";
import type {
  NodeArgsFrameV2ConfigE,
  NodeArgsFrameV2ConfigFp_f,
  NodeArgsFrameV2ConfigFp_F,
  NodeArgsFrameV2ConfigP,
} from "./args.mjs";
import type { OmittedType } from "./common.mjs";

type FrameV2Plugins = {
  RankiFrameV2: {};
};

export type ParseNodeFrameV2 =
  | ParseNodeFrameV2Fp
  | ParseNodeFrameV2F
  | ParseNodeFrameV2E;

export type ParseNodeFrameV2Fp = Omit<AstNodeParent, "subtree"> & {
  plugins: FrameV2Plugins;
  subtree: {
    frameConfig: NodeArgsFrameV2ConfigFp_F | NodeArgsFrameV2ConfigFp_f;
  };
};

export type ParseNodeFrameV2F = Omit<AstNodeParent, "subtree"> & {
  plugins: FrameV2Plugins;
  subtree: {
    frameConfig: NodeArgsFrameV2ConfigP;
  };
};

export type ParseNodeFrameV2E = Omit<AstNodeParent, "subtree"> & {
  plugins: FrameV2Plugins;
  subtree: {
    frameConfig: NodeArgsFrameV2ConfigE;
  };
};

export type ParseNodeFrameV2FpReduced = OmittedType<ParseNodeFrameV2Fp>;

export type ParseNodeFrameV2FReduced = OmittedType<ParseNodeFrameV2F>;

export type ParseNodeFrameV2EReduced = OmittedType<ParseNodeFrameV2E>;
