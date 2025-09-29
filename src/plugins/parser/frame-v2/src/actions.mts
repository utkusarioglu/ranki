import type * as ohm from "ohm-js";
import { zipNodes } from "@ranki/package-api/helpers";
import type { ParseNode } from "@ranki/package-api";
import type {
  NodeArgsFrameV2,
  ParseNodeFrameV2,
  ArgsAndParamsV2FrameV2,
} from "./types.mjs";

const nodeBaseV2: ohm.ActionDict<ParseNode> = {
  block_v2(indentation, v2, wi, ender) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {},
      children: [v2.node(this.args.context)],
    };
  },
  v2Payload_P(wi1, nl, pauseRoot) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        "wi.1.length": wi1.sourceString.length,
      },
      children: [pauseRoot.node(this.args.context)],
    };
  },

  v2Payload_p(pauseRoot) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {},
      children: [pauseRoot.node(this.args.context)],
    };
  },

  pauseRoot(whitespace1, pauseList, whitespace2) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        "whitespace.1.length": whitespace1.sourceString.length,
        "whitespace.2.length": whitespace2.sourceString.length,
      },
      children: [pauseList.node(this.args.context)],
    };
  },

  pauseList(v2PayloadSection1, pausedContainer, v2PayloadSection2) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {},
      children: zipNodes(
        this.args.context,
        v2PayloadSection1,
        pausedContainer,
        v2PayloadSection2,
      ),
    };
  },

  v2PayloadSection(v2PayloadSectionItem1, whitespace, v2PayloadSectionItem2) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {},
      children: zipNodes(
        this.args.context,
        v2PayloadSectionItem1,
        whitespace,
        v2PayloadSectionItem2,
      ),
    };
  },

  v2PayloadPlain(plain) {
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        type: "mixed",
        value: plain.sourceString,
      },
    };
  },

  // !TODO
  pausedContainer(
    whitespace1,
    pauseStart,
    pausedPayload,
    pauseEnd,
    whitespace2,
  ) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {},
      children: [
        {
          kind: "leaf",
          type: this.ctorName,
          print: true,
          args: {},
          source: {
            type: "mixed",
            value: pausedPayload.sourceString,
          },
        },
      ],
    };
  },
};

const nodeFrameV2: ohm.ActionDict<ParseNodeFrameV2> = {
  v2_fp(directive, frame, v2FrameConfig, v2Payload, v2End) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        ...v2FrameConfig.v2FrameConfig(this.args.context),
      },
      children: [v2Payload.node(this.args.context)],
    };
  },

  v2_dfp(directive, directiveConfig, frame, v2FrameConfig, v2Payload, v2End) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        ...directiveConfig.v2FrameConfig(this.args.context),
        ...v2FrameConfig.v2FrameConfig(this.args.context),
      },
      children: [v2Payload.node(this.args.context)],
    };
  },
};

const v2FrameConfig: ohm.ActionDict<NodeArgsFrameV2> = {
  v2DirectiveConfig_D(wi1, nl, wi2, v2ParamListBlock, whitespace) {
    const params = v2ParamListBlock.paramsV2(this.args.context);
    return {
      "directive.v2": {
        type: this.ctorName,
        args: {
          "wi.1.length": wi1.sourceString.length,
          "wi.2.length": wi2.sourceString.length,
        },
        params: {
          variant: "block",
          items: params,
        },
      },
    };
  },

  v2DirectiveConfig_d(wi1, v2ParamListInline, wi2) {
    const params = v2ParamListInline.paramsV2(this.args.context);
    return {
      "directive.v2": {
        type: this.ctorName,
        args: {
          "wi.1.length": wi1.sourceString.length,
          "wi.2.length": wi2.sourceString.length,
        },
        params: {
          variant: "inline",
          items: params,
        },
      },
    };
  },

  v2FrameConfigP(wi1, v2Type, wi2, sep) {
    return {
      "frame.v2": {
        type: this.ctorName,
        frameType: v2Type.sourceString,
        variant: "p",
        args: {
          "wi.1.length": wi1.sourceString.length,
          "wi.2.length": wi2.sourceString.length,
          "separator.right.type": sep.creatorName(this.args.context),
        },
      },
    };
  },

  v2FrameConfigFp_f(
    wi1,
    v2Type,
    wi2,
    v2ParamListInlineContainer,
    wi3,
    sepRight,
  ) {
    const config: ArgsAndParamsV2FrameV2 =
      v2ParamListInlineContainer.argsAndParamsV2(this.args.context);
    return {
      "frame.v2": {
        type: this.ctorName,
        frameType: v2Type.sourceString,
        variant: "fp_f",
        args: {
          "wi.1.length": wi1.sourceString.length,
          "wi.2.length": wi2.sourceString.length,
          "wi.3.length": wi3.sourceString.length,

          // !FIX this expects iter if `creatorName` is called
          // "separator.right.type": sepRight.creatorName(this.args.context),
          "separator.right.type": sepRight.sourceString,

          "frame.v2.config": config.args,
        },
        params: config.params,
      },
    };
  },

  v2FrameConfigFp_F(
    wi1,
    v2Type,
    wi2,
    v2ParamListBlockContainer,
    wi3,
    sepRight,
  ) {
    const config: ArgsAndParamsV2FrameV2 =
      v2ParamListBlockContainer.argsAndParamsV2(this.args.context);
    return {
      "frame.v2": {
        type: this.ctorName,
        frameType: v2Type.sourceString,
        variant: "fp_F",
        args: {
          "wi.1.length": wi1.sourceString.length,
          "wi.2.length": wi2.sourceString.length,
          "wi.3.length": wi3.sourceString.length,
          // !FIX sepRight doesn't work
          // "separator.right.type": sepRight.creatorName(this.args.context),
          "separator.right.type": sepRight.sourceString,
          "frame.v2.config": config.args,
        },
        params: config.params,
      },
    };
  },
};

export const actions = {
  node: {
    ...nodeFrameV2,
    ...nodeBaseV2,
  },
  v2FrameConfig,
};
