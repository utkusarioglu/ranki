import type { IAstNodeActionDict } from "@dqm/package-dqm-api-v2";
import { assertExists, grabAst } from "@dqm/package-utils";

export const node: IAstNodeActionDict = {
  paramsV2Key(paramsV2KeyWord1, tParamsV2SeparatorKeyLevel, paramsV2KeyWord2) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["node", paramsV2KeyWord1])
      .pushNodes(
        ["token", tParamsV2SeparatorKeyLevel],
        ["node", paramsV2KeyWord2],
      );
  },

  paramsV2KeyWord(letter, paramsV2KeyWordLegal) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(letter, paramsV2KeyWordLegal);
  },

  paramsV2ParamListInlineContainer(
    tParamsV2SeparatorParam1,
    sBaseV2WasteInline1,
    paramsV2ParamListInline,
    sBaseV2WasteInline2,
    tParamsV2SeparatorParam2,
  ) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["token", tParamsV2SeparatorParam1])
      .pushNodes(["space", sBaseV2WasteInline1])
      .pushNodes(["node", paramsV2ParamListInline])
      .pushNodes(["space", sBaseV2WasteInline2])
      .pushNodes(["token", tParamsV2SeparatorParam2]);
  },

  paramsV2ParamListInline(
    paramsV2Param1,
    paramsV2SepLeftInline,
    paramsV2Param2,
  ) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["node", paramsV2Param1])
      .pushNodes(["token", paramsV2SepLeftInline], ["node", paramsV2Param2]);
  },

  paramsV2Setting(paramsV2SettingAudience, paramsV2FormatOperator) {
    const p = grabAst(this)
      .newParam(this)
      .pushNodes(["node", paramsV2SettingAudience])
      .pushNodes(["node", paramsV2FormatOperator]);
    // @ts-expect-error NOT YET USED
    const audience = p.findSubtreeNodeByCreator("paramsV2SettingAudience");
    const operator = p.findSubtreeNodeByCreator("paramsV2FormatOperator");
    assertExists(operator, {});
    // if (!o) {
    //   throw new DqmError("REQUIRED_NODE_ABSENT", {
    //     creator: "paramsV2FormatOperator",
    //     parent: p,
    //   });
    // }
    // const key = o
    //   .getSubtreeNodes()
    //   .find((n) => n.getCreator() === );
    const key = operator.findSubtreeNodeByCreator("paramsV2Key");
    assertExists(key, {});
    // const op = o
    //   .getSubtreeNodes()
    //   .find((n) => n.getCreator() === "paramsV2Operator");
    const op = operator.findSubtreeNodeByCreator("paramsV2Operator");
    if (op) {
      // TODO this is where you set the operator
      // p.setOperator()
    }
    const valuesNode = operator.findSubtreeNodeByCreator("paramsV2Values");
    assertExists(valuesNode, {});
    // const valuesNode = o
    //   .getSubtreeNodes()
    //   .find((n) => n.getCreator() === "paramsV2Values");

    // if (!valuesNode) {
    //   throw new DqmError("REQUIRED_NODE_ABSENT", {
    //     creator: "paramsV2Values",
    //     parent: p,
    //   });
    // }
    const values = valuesNode.getSubtreeNodes().map((v) => v.getLeafView());
    // .map((v) => ({ type: v.type, value: v.raw }));
    p.setValues(values);

    p.setId(key.getSubtreeNodes().map((k) => k.getSourceString()));
    p
      // this is wrong,
      // .setAudience(0)
      .setChannel("settings");

    return p;
  },

  paramsV2FormatOperator(
    paramsV2Key,
    sBaseV2WasteInline1,
    paramsV2Operator,
    sBaseV2WasteInline2,
    paramsV2Values,
  ) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["node", paramsV2Key])
      .pushNodes(["space", sBaseV2WasteInline1])
      .pushNodes(["token", paramsV2Operator])
      .pushNodes(["space", sBaseV2WasteInline2])
      .pushNodes(["node", paramsV2Values]);
  },

  paramsV2Values(paramsV2ValueItem1, sBaseV2Clearance, paramsV2ValueItem2) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["node", paramsV2ValueItem1])
      .pushNodes(["space", sBaseV2Clearance], ["node", paramsV2ValueItem2]);
  },

  // paramsV2ValueItem(a) {
  //   return grabAst(this).newAst(this).pushIgnoredNodes(a);
  // },

  paramsV2ValueItemPrimitive(n) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(n)
      .setLeafViewDecoder("number", (v) => ({
        number: +v,
      }));
  },
};
