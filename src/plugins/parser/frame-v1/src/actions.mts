import type * as ohm from "ohm-js";
import type { ParseNode } from "@ranki/package-api";
import type { ParseNodeFrameV1 } from "./types.mjs";
import type { ArgsAndParamsV1 } from "./types.mjs";

const nodeBaseV2: ohm.ActionDict<ParseNode> = {
  block_v1(indentation, v1Block, wi1, end) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        "indentation.1.length": indentation.sourceString.length,
        "wi.1.length": wi1.sourceString.length,
        // !TODO end
      },
      children: [v1Block.node(this.args.context)],
    };
  },
};

const nodeFrameV1: ohm.ActionDict<ParseNodeFrameV1> = {
  v1Inline_p(
    frameV1_1,
    wi1,
    v1Type,
    wi2,
    sepRight1,
    // wi3,
    // v1ParamListInline,
    // wi4,
    // sepRight2,
    v1PayloadInline,
    frameV1_2,
  ) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        "wi.1.length": wi1.sourceString.length,
        "wi.2.length": wi2.sourceString.length,
        // "wi.3.length": wi3.sourceString.length,
        // "wi.4.length": wi4.sourceString.length,
        "frame.v1": {
          variant: "p",
          frameType: v1Type.sourceString,
          // args: {
          //   // v1ParamListInline
          // },
        },
      },
      children: [
        {
          kind: "leaf",
          print: true,
          type: "TEMP PAYLOAD V1 NODE",
          args: {},
          source: {
            type: "mixed",
            value: v1PayloadInline.sourceString,
          },
        },
      ],
    };
  },

  v1Inline_fp(
    frameV1_1,
    wi1,
    v1Type,
    wi2,
    sepRight1,
    wi3,
    v1ParamListInline,
    wi4,
    sepRight2,
    v1PayloadInline,
    frameV1_2,
  ) {
    const argsAndParamsV1 = v1ParamListInline.argsAndParamsV1(
      this.args.context,
    );
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        "wi.1.length": wi1.sourceString.length,
        "wi.2.length": wi2.sourceString.length,
        // "wi.3.length": wi3.sourceString.length,
        // "wi.4.length": wi4.sourceString.length,
        "frame.v1": {
          variant: "fp",
          frameType: v1Type.sourceString,
          ...argsAndParamsV1,
          // params: ,
          // args: {
          //   ...c.args,
          // },
        },
      },
      children: [
        {
          kind: "leaf",
          print: true,
          type: "TEMP PAYLOAD V1 NODE",
          args: {},
          source: {
            type: "mixed",
            value: v1PayloadInline.sourceString,
          },
        },
      ],
    };
  },

  v1Block_p(
    frameV1_1,
    wi1,
    v1Type,
    wi2,
    sep,
    wi3,
    nl1,
    v1PayloadBlock,
    v1BlockEnd,
  ) {
    // const argsAndParamsV1 = v1ParamListInline.argsAndParamsV1(
    //   this.args.context,
    // );
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        "wi.1.length": wi1.sourceString.length,
        "wi.2.length": wi2.sourceString.length,
        // "wi.3.length": wi3.sourceString.length,
        // "wi.4.length": wi4.sourceString.length,
        "frame.v1": {
          variant: "p",
          frameType: v1Type.sourceString,
          // ...argsAndParamsV1,
          // params: ,
          // args: {
          //   ...c.args,
          // },
        },
      },
      children: [
        {
          kind: "leaf",
          print: true,
          type: "TEMP PAYLOAD V1 NODE",
          args: {},
          source: {
            type: "mixed",
            value: v1PayloadBlock.sourceString,
          },
        },
      ],
    };
  },

  v1Block_fp(
    frameV1,
    wi1,
    v1Type,
    wi2,
    sepRight1,
    wi3,
    v1ParamListInline,
    wi4,
    sep,
    wi5,
    nl1,
    v1PayloadBlock,
    v1BlockEnd,
  ) {
    const context = this.args.context;
    const argsAndParamsV1 = v1ParamListInline.argsAndParamsV1(
      this.args.context,
    );
    const parser = context.methods.parser();
    const child = parser(
      this.args.context,
      ["RankiBaseV2", "RankiRichTextV2"],
      v1PayloadBlock.sourceString,
    );
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        // !TODO args
        "wi.1.length": wi1.sourceString.length,
        "wi.2.length": wi2.sourceString.length,
        "wi.3.length": wi3.sourceString.length,
        "wi.4.length": wi4.sourceString.length,
        "wi.5.length": wi5.sourceString.length,
        "frame.v1": {
          variant: "fp",
          frameType: v1Type.sourceString,
          ...argsAndParamsV1,
          report: child.report,
        },
      },
      children: [
        child.stages.parse.root,
        // {
        //   kind: "leaf",
        //   print: true,
        //   type: "TEMP PAYLOAD V1 NODE",
        //   args: {},
        //   source: {
        //     type: "mixed",
        //     value: v1PayloadBlock.sourceString,
        //   },
        // },
      ],
    };
  },
};

const paramV1: ohm.ActionDict<string> = {
  v1ParamValue(val) {
    return val.sourceString;
  },
};

const paramsV1: ohm.ActionDict<string[]> = {
  _iter(...children) {
    return children.map((v) => v.paramV1(this.args.context));
  },
};

const argsAndParamsV1: ohm.ActionDict<ArgsAndParamsV1> = {
  v1ParamListInline(v1ParamValue1, sep, v1ParamValue2) {
    return {
      args: {},
      params: [
        v1ParamValue1.paramV1(this.args.context),
        ...v1ParamValue2.paramsV1(this.args.context),
      ],
    };
  },
};

export const actions = {
  node: {
    ...nodeFrameV1,
    ...nodeBaseV2,
  },
  paramV1,
  paramsV1,
  argsAndParamsV1,
};
