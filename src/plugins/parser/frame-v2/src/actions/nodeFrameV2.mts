import type {
  RankiLangAstContext,
  RankiLanguageProvidedConfig,
} from "@ranki/package-api";
import type * as ohm from "ohm-js";
import type {
  NodeArgsFrameV2Config,
  NodeArgsFrameV2ConfigFp_F,
  NodeArgsFrameV2E,
  ParseNodeFrameV2,
} from "../types.mjs";
import type {
  // NodeArgsFrameV2,
  // ArgsAndParamsV2FrameV2,
  FrameSpec,
} from "../types.mjs";
// !FIX should come from exports
import type { ParamV2 } from "@ranki/plugin-parser-params-v2";

type ConvertParamsParams = {
  shorthands: Record<string, string[]>;
  positional: string[][];
};

function convertParams<T extends ParamV2>(
  params: T[],
  { shorthands, positional }: ConvertParamsParams,
) {
  const converted: ParamV2[] = [];

  params.forEach((p, i) => {
    if (p.key === "positional") {
      if (positional.length === 0) {
        throw new Error(
          `NO POSITIONAL PARAMS DEFINED FOR VALUE: "${p.values
            .map((v) => v.value)
            .join(" ")}"`,
        );
      }

      if (positional.length <= i) {
        throw new Error(
          `MORE POSITIONAL PARAMS THAN DEFINED FOR FRAME: ${positional.join(
            ", ",
          )}`,
        );
      }

      converted.push({
        ...p,
        key: positional[i],
      });
      return;
    }

    const isShorthand =
      p.key.length === 1 && shorthands.hasOwnProperty(p.key[0]);

    if (isShorthand) {
      converted.push({
        ...p,
        key: shorthands[p.key[0]],
      });
    } else {
      converted.push(p);
    }
    return converted;
  });

  const config = {} as any; // TODO any

  console.log(converted);

  converted.forEach((p) => {
    let step = config;
    if (p.key === "positional") {
      throw new Error("YOU SHOULDN'T BE ABLE TO REACH THIS");
    }
    p.key.slice(0, -1).forEach((k) => {
      step[k] = {};
      step = step[k];
    });
    const last: string = p.key.at(-1)!;
    switch (p.operator) {
      case "assign":
        // FIX this discards values other than the first
        step[last] = p.values[0].value;
        break;
      case "append":
        if (step[last] === undefined) {
          step[last] = [];
        }
        p.values.forEach((v) => {
          step[last].push(v.value);
        });
        break;
      default:
        throw new Error(
          `UNRECOGNIZED OPERATOR: ${p.key.join(".")}: ${p.operator}`,
        );
    }
  });

  return config;
}

function parseSettings(
  { directive, setting }: any,
  frameConfig: NodeArgsFrameV2ConfigFp_F,
) {
  if (!frameConfig.frame.params) {
    return { config: null };
  }
  const items = frameConfig.frame.params.items;
  const directiveParams = items.filter((p) => p.type === "directive");
  const settingParams = items.filter((p) => p.type === "setting");

  const directives = convertParams(directiveParams, directive);
  const settings = convertParams(settingParams, setting);

  return { directives, settings };
}

export const nodeFrameV2: ohm.ActionDict<ParseNodeFrameV2> = {
  v2_fp(directive, frame, v2FrameConfig, v2Payload, v2End) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    const frameConfig: NodeArgsFrameV2ConfigFp_F =
      v2FrameConfig.v2FrameConfig(context);

    const { directives, settings } = parseSettings(
      {
        setting: {
          positional: [["path"]],
          shorthands: {
            b: ["cat", "dog"],
          },
        },
        directive: {
          positional: [],
          shorthands: {
            p: ["content", "prefix"],
          },
        },
      },
      frameConfig,
    );

    console.log({ directives, settings });

    const child = context.lang.clone([directives]).parse(
      { [context.theater]: v2Payload.sourceString },
      {
        ...context,
        frame: {
          version: "v2",
          chain: frameConfig.frame.chain,
          directives,
          settings,
        },
        // startRule: "v2Payload",
      },
    );
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        ...frameConfig,

        report: child.report,
      },
      // children: [v2Payload.node(context)],

      children: [child.theaters[context.theater].stages.ast.root],
    };
  },

  // @ts-expect-error FIX type in this doesn't seem to work
  // likely due to a design error
  v2_e(directive, frame, wi1, v2Chain, wi2, v2End) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    const chain: FrameSpec[] = v2Chain.frameSpecV2(context);
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        frame: {
          version: "v2",
          variant: "e",
          chain,
          args: {
            "wi.1.length": wi1.sourceString.length,
            "wi.2.length": wi2.sourceString.length,
          },
          // params: [],
        },
        // ...v2FrameConfig.v2FrameConfig(context),
      },
      children: [],
    };
  },
};
