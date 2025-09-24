import type { NodeArgs } from "@ranki/package-api";

export interface ArgsAndParamsV1 {
  args: NodeArgs;
  params: string[];
}

type FrameV1Config = FrameV1ConfigP | FrameV1ConfigFp;

export interface FrameV1ConfigP {
  "frame.v1": {
    // type: string;
    variant: "p"; // this is like f fp
    frameType: string; // like code in %:code; ...:%
    // args: NodeArgs;
  };
}

export interface FrameV1ConfigFp {
  "frame.v1": {
    // type: string;
    variant: "fp"; // this is like f fp
    frameType: string; // like code in %:code; ...:%
    // args: NodeArgs;
    params: string[];
    // params: Pa
  };
}
