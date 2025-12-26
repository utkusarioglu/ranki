import type { IAstParamNode } from "@dqm/package-dqm-api-v2";
import { assertExists } from "@dqm/package-dqm-utils";

export function astParamCapability<T>(self: T) {
  let astParam: IAstParamNode | null = null;

  function getAstParam(): IAstParamNode {
    assertExists(astParam, {
      why: "Expecting ast param to be defined when it's not is an architectural issue",
    });
    return astParam;
  }
  return {
    setAstParam(r: IAstParamNode): T {
      astParam = r;
      return self;
    },
    getAstParam,

    // setAudience: (...a) => getAstParam().setAudience(...a),
    getAudience: () => getAstParam().getAudience(),
    // setOperator: getAstParam().setOperator,
    getOperator: () => getAstParam().getOperator(),
    // setProducer: getAstParam().setProducer,
    getProducer: () => getAstParam().getProducer(),
    getValues: () => getAstParam().getValues(),
    // setChannel: getAstParam().setChannel,
    // getChannel: getAstParam().getChannel,
  };
}
