import type {
  ComponentPluginComponentStageAst,
  ParamParserReturn,
  // RankiLangAstContext,
  RankiLangParseDefinition,
} from "@ranki/package-api-v2";
import type { ParamV2 } from "@ranki/plugin-grammar-params-v2";
import type { ConvertParamsParams } from "../types/handler.mjs";

function convertParams<T extends ParamV2>(
  params: T[],
  { shorthands, positional }: ConvertParamsParams,
) {
  const converted: ParamV2[] = [];

  params.forEach((p, i) => {
    if (positional) {
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
    }

    if (shorthands) {
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

export function paramParser(
  def: RankiLangParseDefinition,
  componentAst: ComponentPluginComponentStageAst,
  // context: RankiLangAstContext,
): ParamParserReturn {
  // const def = context.getParserDefinition();
  if (!def.params) {
    return { config: [] };
  }
  const items = def.params;
  const directiveParams = items.filter((p) => p.type === "directive");
  const settingParams = items.filter((p) => p.type === "setting");

  const config = convertParams(
    // @ts-expect-error
    directiveParams,
    componentAst.directives,
  );
  const settings = convertParams(
    // @ts-expect-error
    settingParams,
    componentAst.params,
  );

  return { config: [config], settings };
}
