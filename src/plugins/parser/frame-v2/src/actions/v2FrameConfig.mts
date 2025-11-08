import { getContext as c } from "@ranki/package-api-v2/helpers";
import type * as ohm from "ohm-js";
import type {
  NodeArgsFrameV2,
  NodeArgsFrameV2ConfigFp_f_Reduced,
  NodeArgsFrameV2ConfigP_Reduced,
  NodeArgsFrameV2ConfigFp_F_Reduced,
} from "../types/args.mjs";
import type { ArgsAndParamsV2 } from "@ranki/plugin-grammar-params-v2";
import type { ComponentChain } from "@ranki/package-api-v2";

export const v2FrameConfig: ohm.ActionDict<NodeArgsFrameV2> = {
  v2FrameConfigP(wi1, v2Type, wi2, sep) {
    const context = c(this).newChild(this, "block");

    const chainList: ComponentChain[] = v2Type.frameSpecV2(context);
    return context.newAstNode<NodeArgsFrameV2ConfigP_Reduced, NodeArgsFrameV2>(
      {
        type: "RankiFrameV2",
        version: "v2",
        variant: "p",
        chainList,
        shape: {
          separators: [
            {
              type: sep.creatorName(context),
              raw: sep.sourceString,
            },
          ],
          spaces: {
            startAndType: {
              type: "wi",
              raw: wi1.sourceString,
            },
            typeAndSep: {
              type: "wi",

              raw: wi2.sourceString,
            },
          },
        },
        params: {
          variant: "none",
          items: [],
        },
      },
      {
        subtree: {},
      },
    );
  },

  v2FrameConfigFp_f(
    wi1,
    v2Type,
    wi2,
    v2ParamListInlineContainer,
    wi3,
    sepRight,
  ) {
    const context = c(this).newChild(this, "block");
    const config: ArgsAndParamsV2 =
      v2ParamListInlineContainer.shapeAndParamsV2(context);

    const chainList: ComponentChain[] = v2Type.frameSpecV2(context);
    return context.newAstNode<
      NodeArgsFrameV2ConfigFp_f_Reduced,
      NodeArgsFrameV2
    >(
      {
        type: "RankiFrameV2",
        version: "v2",
        chainList,
        variant: "fp_f",
        shape: {
          spaces: {
            start: {
              type: "wi",
              raw: wi1.sourceString,
            },
            typeAndParams: {
              type: "wi",
              raw: wi2.sourceString,
            },
            paramsAndSep: {
              type: "wi",
              raw: wi3.sourceString,
            },
          },
          separators: [
            {
              type: sepRight.creatorName(context),
              raw: sepRight.sourceString,
            },
          ],
        },
        params: config.params,
      },
      {
        subtree: {
          paramsContainer: {
            shape: config.shape,
          },
        },
      },
    );
  },

  v2FrameConfigFp_F(
    wi1,
    v2Type,
    wi2,
    v2ParamListBlockContainer,
    wi3,
    sepRight,
  ) {
    const context = c(this).newChild(this, "block");
    const config: ArgsAndParamsV2 =
      v2ParamListBlockContainer.shapeAndParamsV2(context);
    const chainList: ComponentChain[] = v2Type.frameSpecV2(context);

    return context.newAstNode<
      NodeArgsFrameV2ConfigFp_F_Reduced,
      NodeArgsFrameV2
    >(
      {
        type: "RankiFrameV2",
        version: "v2",
        variant: "fp_F",
        chainList,
        shape: {
          spaces: {
            start: {
              type: "wi",
              raw: wi1.sourceString,
            },
            typeAndParams: {
              type: "wi",
              raw: wi2.sourceString,
            },
            paramsAndSep: {
              type: "wi",
              raw: wi3.sourceString,
            },
          },
          separators: [
            {
              type: sepRight.creatorName(context),
              raw: sepRight.sourceString,
            },
          ],
        },
        params: config.params,
      },
      {
        subtree: {
          paramsContainer: {
            shape: config.shape,
          },
        },
      },
    );
  },
};
