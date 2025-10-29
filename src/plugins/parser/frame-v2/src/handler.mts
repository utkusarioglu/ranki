import type {
  RankiLangAstContext,
  RankiLangParseHandlerFunction,
} from "@ranki/package-api-v2";
import type { ParamV2 } from "@ranki/plugin-grammar-params-v2";

export const handler: RankiLangParseHandlerFunction = (
  theaterRaw,
  context,
  parser,
) => {
  const parserDef = parser.expandedDefinition;
  // const parser = context.getParserDefinition();
  if (parserDef.type !== "RankiFrameV2") {
    throw new Error(`FRAME V2 HANDLER GIVEN NON-FRAME V2 COMPONENT`);
  }
  if (parserDef.chain.length > 1) {
    throw new Error(`MULTI-LENGTH CHAINS NOT YET SUPPORTED`);
  }
  const component = context.getComponent("RankiFrameV2", parserDef.chain[0]);

  // TODO I think the settings are not communicated back to the ast
  const { directives, settings } = parseSettings(
    component.stages.ast.params,
    context,
  );
  // TODO this is to be removed
  settings && true;
  const cloned = context.cloneLang([
    component.stages.ast.directives,
    directives,
  ]);
  // const contextV2 = context.newChild("block");
  // const contextV2Old: RankiLangAstContext = {
  //   parser: context.parser,
  //   astHash: "",
  //   hooks: cloned.hooks,
  //   blockDepth: context.blockDepth + 1,
  //   inlineDepth: context.inlineDepth,
  //   theater: context.theater,
  //   role: context.role,
  //   startRule: context.startRule,
  // };

  // TODO
  const contentConfig = cloned.hooks.getConfig().merged.content;

  const theaterWithContent = [
    contentConfig.prefix,
    component.stages.preprocess(theaterRaw),
    contentConfig.suffix,
  ].join("");

  return parser.callback(theaterWithContent);
};

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
            .map((v) => v.raw)
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
        step[last] = p.values[0].raw;
        break;
      case "append":
        if (step[last] === undefined) {
          step[last] = [];
        }
        p.values.forEach((v) => {
          step[last].push(v.raw);
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
  frameConfig: RankiLangAstContext,
) {
  const parser = frameConfig.getParserDefinition();
  if (!parser.params) {
    return { config: null };
  }
  const items = parser.params;
  const directiveParams = items.filter((p) => p.type === "directive");
  const settingParams = items.filter((p) => p.type === "setting");

  const directives = convertParams(
    // @ts-expect-error
    directiveParams,
    directive,
  );
  const settings = convertParams(
    // @ts-expect-error
    settingParams,
    setting,
  );

  return { directives, settings };
}
