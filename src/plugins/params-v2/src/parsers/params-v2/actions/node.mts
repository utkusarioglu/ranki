import type { IAstNodeActionDict } from "@dqm/package-dqm-api-v2";
import { assertExists, DqmError, grabAst } from "@dqm/package-utils";

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

  paramsV2Setting(paramsV2SettingAudience, paramsV2Format) {
    const p = grabAst(this)
      .newParam(this)
      .pushNodes(["node", paramsV2SettingAudience])
      .pushNodes(["node", paramsV2Format]);

    const paramsV2FormatNode = p.getSubtreeNodes().at(-1);
    assertExists(paramsV2FormatNode, {});

    const creator = paramsV2FormatNode.getCreator();
    switch (creator) {
      case "paramsV2FormatAssigned":
        {
          const key =
            paramsV2FormatNode.findSubtreeNodeByCreator("paramsV2Key");
          assertExists(key, { what: "key" });
          const op =
            paramsV2FormatNode.findSubtreeNodeByCreator("paramsV2Operator");
          assertExists(op, { why: "Needs an operator" });
          const meaning = op.getTokenNodes()[0].getMeaning();
          switch (meaning) {
            case "assign":
            case "append":
            case "prepend":
            case "shift":
            case "unshift":
              p.setOperator(meaning);
              break;
            default:
              throw new DqmError("UNDEFINED_MEANING", {
                meaning,
              });
          }
          const valuesNode =
            paramsV2FormatNode.findSubtreeNodeByCreator("paramsV2Values");
          assertExists(valuesNode, {});
          const values = valuesNode
            .getSubtreeNodes()
            .map((v) => v.getLeafView());
          p.setValues(values);
          p.setId(key.getSubtreeNodes().map((k) => k.getSourceString()));
        }
        break;
      case "paramsV2FormatPositive":
      case "paramsV2FormatNegative":
        {
          const key =
            paramsV2FormatNode.findSubtreeNodeByCreator("paramsV2Key");
          assertExists(key, {});
          p.setId(
            paramsV2FormatNode
              .getSubtreeNodes()
              .map((k) => k.getSourceString()),
          );
          p.setValues([
            {
              type: "boolean",
              raw: "true",
              boolean: creator === "paramsV2FormatPositive",
            },
          ]);
        }
        break;
      case "paramsV2FormatPositional":
        {
          // TODO you need sibling index as position here
          const values = paramsV2FormatNode
            .getSubtreeNodes()
            .map((v) => v.getLeafView());
          // .map((v) => v.getLeafView());
          p.setValues(values);
          // const key =
          //   paramsV2FormatNode.findSubtreeNodeByCreator("paramsV2Key");
          // console.log({ key: key?.getSourceString() });
          // assertExists(key, {});
          // p.setId(
          //   paramsV2FormatNode
          //     .getSubtreeNodes()
          //     .map((k) => k.getSourceString()),
          // );

          // console.log(
          //   "chi",
          //   values.map((v) => v.getLeafView()),
          // );
          // p.setValues([{ type: "boolean", raw: "true", boolean: true }]);
        }
        break;
    }

    p
      // this is wrong,
      // .setAudience(0)
      .setChannel("settings");

    return p;
  },

  paramsV2FormatPositional(paramsV2ValueItem) {
    return grabAst(this).newAst(this).pushNodes(["node", paramsV2ValueItem]);
  },

  paramsV2FormatPositive(paramsV2Key) {
    return grabAst(this).newAst(this).pushNodes(["node", paramsV2Key]);
  },

  paramsV2FormatNegative(tParamsV2Negation, paramsV2Key) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["token", tParamsV2Negation])
      .pushNodes(["node", paramsV2Key]);
  },

  paramsV2FormatAssigned(
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
      .pushNodes(["node", paramsV2Operator])
      .pushNodes(["space", sBaseV2WasteInline2])
      .pushNodes(["node", paramsV2Values]);
  },

  paramsV2Values(paramsV2ValueItem1, sBaseV2Clearance, paramsV2ValueItem2) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["node", paramsV2ValueItem1])
      .pushNodes(["space", sBaseV2Clearance], ["node", paramsV2ValueItem2]);
  },

  paramsV2ValueItemPrimitive_number(n) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(n)
      .setLeafViewDecoder("number", (v) => ({
        number: +v,
      }));
  },

  paramsV2ValueItemPrimitive_lowercase(lower, sBaseV2Clearance, lowerPlus) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(lower, sBaseV2Clearance, lowerPlus)
      .setLeafViewDecoder("string", () => ({
        subtype: "lowercase",
      }));
  },

  paramsV2ValueItemPrimitive_uppercase(upper, sBaseV2Clearance, upperPlus) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(upper, sBaseV2Clearance, upperPlus)
      .setLeafViewDecoder("string", () => ({
        subtype: "uppercase",
      }));
  },

  paramsV2ValueItemPrimitive_chars(letter, sBaseV2Clearance, letterPlus) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(letter, sBaseV2Clearance, letterPlus)
      .setLeafViewDecoder("string", () => ({
        subtype: "chars",
      }));
  },

  paramsV2ValueItemPrimitive_mixed(letterDigit) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(letterDigit)
      .setLeafViewDecoder("string", () => ({
        subtype: "mixed",
      }));
  },

  paramsV2ValueItemPrimitive_true(n) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(n)
      .setLeafViewDecoder("boolean", () => ({
        boolean: true,
      }));
  },

  paramsV2ValueItemPrimitive_false(n) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(n)
      .setLeafViewDecoder("boolean", () => ({
        boolean: false,
      }));
  },

  paramsV2Operator(token) {
    return grabAst(this).newAst(this).pushNodes(["token", token]);
  },
};
