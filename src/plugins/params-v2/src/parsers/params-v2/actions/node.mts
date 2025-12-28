import type { IAstNodeActionDict } from "@dqm/package-dqm-api-v2";
import {
  grabAssertNodeExists,
  grabAst,
  grabConstant,
  grabError,
} from "@dqm/package-plugin-utils";

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

  paramsV2SettingAudience(val) {
    return grabAst(this).newAst(this).pushIgnoredNodes(val);
    // .setMeaning(val.sourceString);
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

  paramsV2ChannelAndAudience(
    tParamsV2DirectiveParam,
    paramsV2SettingAudience,
    tParamsV2SeparatorKeyLevel,
  ) {
    return grabAst(this)
      .newParam(this)
      .pushNodes(["token", tParamsV2DirectiveParam])
      .pushNodes(["node", paramsV2SettingAudience])
      .pushIgnoredNodes(tParamsV2SeparatorKeyLevel);
  },

  paramsV2Param(
    // tParamsV2DirectiveParam,
    // paramsV2SettingAudience,
    paramsV2ChannelAndAudience,
    paramsV2Format,
  ) {
    const p = grabAst(this)
      .newParam(this)
      .pushNodes(["node", paramsV2ChannelAndAudience])
      .pushNodes(["node", paramsV2Format]);

    const [first, second] = p.getSubtreeNodes();

    const [paramsV2ChannelAndAudienceNode, paramsV2FormatNode] =
      second === undefined ? [undefined, first] : [first, second];

    if (paramsV2ChannelAndAudienceNode) {
      const [audience] = paramsV2ChannelAndAudienceNode.getSubtreeNodes();
      const [channel] = paramsV2ChannelAndAudienceNode.getTokenNodes();
      if (audience) {
        p.setAudience(+audience.getSourceString());
      }
      if (channel) {
        p.setChannel(channel.getMeaning());
      }
      // console.log({
      //   channel: channel !== undefined ? channel.getMeaning() : null,
      //   audience: audience !== undefined ? audience.getMeaning() : null,
      // });
    }
    // const paramsV2FormatNode = subs.at(-1);
    // grabAssertNodeExists(this, paramsV2FormatNode, "paramsV2Format");

    const creator = paramsV2FormatNode.getCreator();
    switch (creator) {
      case "paramsV2FormatAssigned":
        {
          const key =
            paramsV2FormatNode.findSubtreeNodeByCreator("paramsV2Key");
          grabAssertNodeExists(this, key, "paramsV2Key", { creator });
          const op =
            paramsV2FormatNode.findSubtreeNodeByCreator("paramsV2Operator");
          grabAssertNodeExists(this, op, "paramsV2Operator", { creator });
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
              throw grabError(
                this,
                "UNDEFINED_MEANING",
                "Failed switch selection",
                { meaning },
              );
          }
          const valuesNode =
            paramsV2FormatNode.findSubtreeNodeByCreator("paramsV2Values");
          grabAssertNodeExists(this, valuesNode, "paramsV2Values");
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
          grabAssertNodeExists(this, key, "paramsV2Key", { creator });
          p.setId(
            paramsV2FormatNode
              .getSubtreeNodes()
              .map((k) => k.getSourceString()),
          );
          p.setOperator("assign");
          p.setValues([
            {
              type: "boolean",
              raw: "true",
              value: creator === "paramsV2FormatPositive",
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
          p.setValues(values).setId(grabConstant(this, "POSITIONAL_PARAM"));
          p.setOperator("assign");
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

    // p
    //   // this is wrong,
    //   // .setAudience(0)
    //   .setChannel("settings");

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

  paramsV2Operator(token) {
    return grabAst(this).newAst(this).pushNodes(["token", token]);
  },
};
