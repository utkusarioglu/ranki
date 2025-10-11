import type {
  RankiLangParseSpecsFrameV2,
  RankiLangParseResult,
  RankiLangParseReport,
  RankiLangAstContext,
} from "@ranki/package-api";
import type { ParamV2 } from "@ranki/plugin-parser-params-v2";
import { RankiLang } from "./rankilang.mjs";

export function parseV2(
  theaterRaw: string,
  // report: RankiLangParseReport,
  spec: RankiLangParseSpecsFrameV2,
  // lang: RankiLang
  {
    lang,
    clone,
    // getComponents,
    parseAst,
  }: any,
): RankiLangParseResult {
  // @ts-expect-error
  const component = lang.components.get(spec.plugin.chain[0]);

  const { directives, settings } = parseSettings(component.ast.params, spec);
  const cloned = clone([component.ast.directives, directives]);
  const report: RankiLangParseReport = {
    language: {
      versions: cloned.parsers.getVersions(),
    },
    // !FIX I don't like that I need to stringify the config for the yaml to appear as expected
    config: JSON.parse(JSON.stringify(cloned.getConfig())),
    theater: spec.theater,
    role: spec.role,
  };
  const contextV2: RankiLangAstContext = {
    lang: cloned,
    blockDepth: spec.blockDepth,
    inlineDepth: spec.inlineDepth,
    theater: spec.theater,
    role: spec.role,
    startRule: spec.startRule,
  };

  const contentConfig = (cloned as RankiLang).getConfig().merged.content;
  const prefixLine =
    contentConfig.prefixLine !== "" ? contentConfig.prefixLine + "\n" : "";
  const suffixLine =
    contentConfig.suffixLine !== "" ? "\n" + contentConfig.suffixLine : "";

  const theaterWithContent = [
    prefixLine,
    contentConfig.prefix,
    component.ast.preprocess(theaterRaw),
    contentConfig.suffix,
    suffixLine,
  ].join("");

  return {
    report,
    theaters: {
      [spec.theater]: {
        stages: {
          raw: theaterWithContent,
          ast: parseAst(contextV2, theaterWithContent),
        },
      },
    },
  };
}
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
function parseSettings({ directive, setting }: any, frameConfig: any) {
  if (!frameConfig.plugin && !frameConfig.plugin.params) {
    return { config: null };
  }
  const items = frameConfig.plugin.params.items;
  const directiveParams = items.filter((p) => p.type === "directive");
  const settingParams = items.filter((p) => p.type === "setting");

  const directives = convertParams(directiveParams, directive);
  const settings = convertParams(settingParams, setting);

  return { directives, settings };
}
