import type { IDqmComponentTransformFunction as TF } from "@dqm/package-dqm-api-v2";

const TAGS = ["graphing", "mermaid"];

const FRAME_V2: TF = (trn) => {
  const direction = trn.getAst().getDirection();
  trn.setChain([...TAGS, "container", direction]).setAsMount();
};

const FRAME_V2_PAYLOAD_PLAIN: TF = (trn) => {
  const direction = trn.getAst().getDirection();
  // console.log(
  //   "payload string",
  //   trn.getAst().getSourceString(),
  //   "creator",
  //   trn.getAst().getCreator(),
  //   "child source",
  //   trn.getAst().getChildrenNodes()[0].getSourceString(),
  // );
  trn
    .setChain([...TAGS, "payload", direction])
    // .setSource(trn.getAst().getSourceString());
    // DECIDE trn source string means that the prefix and suffix hasn't been
    // joined yet. it actually means source from the parent parser. not the
    // child. So you need to decide where the boundary should be. the parent,
    // or the likely target of a transform node, which is the first node of the
    // child parser, which is the child node of the transform class
    // PAYLOAD_PLAIN
    .setSource(trn.getAst().getChildrenNodes()[0].getSourceString());
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
