import type { RankiLangAstContext } from "@ranki/package-api";
import type * as ohm from "ohm-js";
import type { ParseNodeFrameV2 } from "../types.mjs";

export const nodeFrameV2: ohm.ActionDict<ParseNodeFrameV2> = {
  v2_fp(directive, frame, v2FrameConfig, v2Payload, v2End) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        ...v2FrameConfig.v2FrameConfig(context),
      },
      children: [v2Payload.node(context)],
    };
  },
  // v2_dfp(directive, directiveConfig, frame, v2FrameConfig, v2Payload, v2End) {
  //   const context: RankiLangAstContext = { ...this.args.context };
  //   context.blockDepth++;
  //   const directiveArgs: NodeArgsDirectiveV2Config =
  //     directiveConfig.v2FrameConfig(context);
  //   const frameArgs: NodeArgsFrameV2Fp_F = v2FrameConfig.v2FrameConfig(context);
  //   const parseSpecs: RankiLangParseSpecs = {
  //     theater: context.theater,
  //     role: context.role,
  //     inlineDepth: context.inlineDepth,
  //     blockDepth: context.blockDepth,
  //     startRule: "v2Payload",
  //     frame: {
  //       version: "v2",
  //       type: frameArgs["frame.v2"].frameType,
  //       directives: directiveArgs["directive.v2"]["params"]["items"],
  //       params: frameArgs["frame.v2"]["params"]["items"],
  //     },
  //   };
  //   const newConfig = applyV2Directives(
  //     context.lang.getConfig().merged,
  //     directiveArgs["directive.v2"]["params"]["items"],
  //     // !TODO this function needs to come from the plugin def for a frame's directive
  //     (i, key, operator, values) => {
  //       let path: string[];
  //       switch (i) {
  //         case 0:
  //           path = ["content", "prefix"];
  //           break;
  //         default:
  //           throw new Error(
  //             `UNDEFINED POSITIONAL PARAM: ${values[0].value.toString()}`,
  //           );
  //       }
  //       return {
  //         path,
  //         operator,
  //         values,
  //       };
  //     },
  //   );
  //   console.log({ newConfig });
  //   const child = context.lang
  //     .clone(newConfig)
  //     .parse({ [context.theater]: v2Payload.sourceString }, parseSpecs);
  //   const theater = child.theaters[context.theater];
  //   // // @ts-expect-error
  //   // frameArgs["frame.v2"]["report"] = theater.stages.ast.report;
  //   // frameArgs["frame.v2"]["specs"] = {
  //   //   directives:
  //   // };
  //   return {
  //     kind: "parent",
  //     type: this.ctorName,
  //     args: {
  //       depth: {
  //         block: context.blockDepth,
  //         inline: context.inlineDepth,
  //         total: context.inlineDepth + context.blockDepth,
  //       },
  //       ...directiveArgs,
  //       ...frameArgs,
  //     },
  //     // children: [v2Payload.node(context)],
  //     children: [theater.stages.ast.root],
  //     // children: [theater.stages.ast],
  //   };
  // },
};
