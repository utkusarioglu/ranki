import type { NodeArgsBaseV2 } from "@ranki/plugin-parser-base-v2";
import type { ParseNode } from "@ranki/package-api";

export interface ArgsAndParamsV1 {
  args: Partial<NodeArgsBaseV2>;
  params: string[];
}

// type FrameV1Config = FrameV1ConfigP | FrameV1ConfigFp;

export interface NodeArgsFrameV1ConfigP {
  "frame.v1": {
    // type: string;
    variant: "p"; // this is like f fp
    frameType: string; // like code in %:code; ...:%
    // args: NodeArgs;
  };
}

export interface NodeArgsFrameV1ConfigFp {
  "frame.v1": {
    // type: string;
    variant: "fp"; // this is like f fp
    frameType: string; // like code in %:code; ...:%
    // args: NodeArgs;
    params: string[];
    // params: Pa
  };
}

export type ParseNodeFrameV1 =
  | ParseNodeFrameV1ConfigP
  | ParseNodeFrameV1ConfigFp;

export type ParseNodeFrameV1ConfigP = Omit<ParseNode, "args"> & {
  args: ParseNode["args"] & Partial<NodeArgsBaseV2> & NodeArgsFrameV1ConfigP;
};

export type ParseNodeFrameV1ConfigFp = Omit<ParseNode, "args"> & {
  args: ParseNode["args"] & Partial<NodeArgsBaseV2> & NodeArgsFrameV1ConfigFp;
};
