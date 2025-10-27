import type { NodeArgsBaseV2 } from "@ranki/plugin-parser-base-v2";
import type { AstNode } from "@ranki/package-api-v2";
import { Single } from "./main.mjs";

export interface ArgsAndParamsV1 {
  shape: Partial<NodeArgsBaseV2>;
  params: string[];
}

// type FrameV1Config = FrameV1ConfigP | FrameV1ConfigFp;

export interface NodeArgsFrameV1ConfigP {
  // "frame.v1": {
  //   // type: string;
  //   variant: "p"; // this is like f fp
  //   frameType: string; // like code in %:code; ...:%
  //   // shape: NodeArgs;
  // };
}

export interface NodeArgsFrameV1ConfigFp {
  // "frame.v1": {
  //   // type: string;
  //   variant: "fp"; // this is like f fp
  //   frameType: string; // like code in %:code; ...:%
  //   // shape: NodeArgs;
  //   params: string[];
  //   // params: Pa
  // };
}

export type ParseNodeFrameV1 =
  | ParseNodeFrameV1ConfigP
  | ParseNodeFrameV1ConfigFp;

export type ParseNodeFrameV1ConfigP = Omit<AstNode, "shape"> & {
  shape: AstNode["shape"] & Partial<NodeArgsBaseV2> & NodeArgsFrameV1ConfigP;
};

export type ParseNodeFrameV1ConfigFp = Omit<AstNode, "shape"> & {
  shape: AstNode["shape"] & Partial<NodeArgsBaseV2> & NodeArgsFrameV1ConfigFp;
};
export interface RankiFrameV1ParserPluginConfig {
  tokens: {
    delimiter: Single;
    separator: {
      param: Single;
    };
  };
}
export type WithRankiFrameV1ParserPluginConfig = {
  RankiFrameV1: RankiFrameV1ParserPluginConfig;
};
