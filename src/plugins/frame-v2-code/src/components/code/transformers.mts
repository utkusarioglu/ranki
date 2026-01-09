import type { IDqmComponentTransformFunction as TF } from "@dqm/package-dqm-api-v2";

const TAGS = ["computer_science", "code"];

const FRAME_V2: TF = (trn) => {
  const direction = trn.getAst().getDirection();
  trn.setChain([...TAGS, "container", direction]).setAsMount();
};

const FRAME_V2_PAYLOAD_PLAIN: TF = (trn) => {
  const direction = trn.getAst().getDirection();
  trn
    .setChain([...TAGS, "payload", direction])
    .setSource(trn.getAst().getSourceString());
};

// // @ts-expect-error
// const FRAME_V2_PAUSED: TF = (trn) => {
//   trn
//     .setChain(["debug", "leaf", "container-2"])
//     .setSource(trn.getAst().getSourceString());
// };

export const transformers = {
  FRAME_V2_PAYLOAD_PLAIN,
  // FRAME_V2_PAUSED,
  FRAME_V2,
};
