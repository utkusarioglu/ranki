import type {
  RankiLanguageConfig,
  RankiLangInstance,
  RankiLangParseResult,
  RankiLangParseSpecs,
  RankiLangAstContext,
  RankiLanguageProvidedConfig,
  RankiLangParseReport,
  RankiLangParseSpecsFrameV2,
  RankiLangParseSpecsFrameV1,
} from "@ranki/package-api";
import { ast } from "./ast.mjs";
import { ParserPlugins } from "./plugins.mjs";
import { RankiLangConfig } from "./config.mjs";
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
  if (!frameConfig.frame && !frameConfig.frame.params) {
    return { config: null };
  }
  const items = frameConfig.frame.params.items;
  const directiveParams = items.filter((p) => p.type === "directive");
  const settingParams = items.filter((p) => p.type === "setting");

  const directives = convertParams(directiveParams, directive);
  const settings = convertParams(settingParams, setting);

  return { directives, settings };
}

export class RankiLang implements RankiLangInstance {
  private config: RankiLangConfig;
  private plugins: ParserPlugins;

  constructor(plugins: ParserPlugins, provided: RankiLanguageProvidedConfig[]) {
    this.plugins = plugins;
    this.config = new RankiLangConfig(plugins.produceConfig(), provided);
  }

  getConfig() {
    return this.config.getAll();
  }

  getPlugins() {
    return this.plugins;
  }

  private clone(
    providedConfigs: RankiLanguageProvidedConfig[] | null,
  ): RankiLangInstance {
    return new RankiLang(this.plugins, this.config.clone(providedConfigs));
  }

  parse(
    raw: Record<string, string>,
    spec: RankiLangParseSpecs = {
      theater: "default",
      role: "default",
      // TODO these values only relevant to frames, maybe they should be in the frame specification
      blockDepth: 0,
      inlineDepth: 0,
      // TODO this one is root if we are at the root and is the frame's default, so maybe this doesn't need to be here
      startRule: "root",
    },
  ): RankiLangParseResult {
    const theaterRaw = raw[spec.theater];

    if (theaterRaw === undefined) {
      throw new Error(`THEATER UNDEFINED: ${spec.theater}`);
    }

    const report: RankiLangParseReport = {
      language: {
        versions: this.plugins.getVersions(),
      },
      config: this.config.getAll(),
      theater: spec.theater,
      role: spec.role,
    };

    const contentConfig = this.config.getAll().merged.content;
    const prefixLine =
      contentConfig.prefixLine !== "" ? contentConfig.prefixLine + "\n" : "";
    const suffixLine =
      contentConfig.suffixLine !== "" ? "\n" + contentConfig.suffixLine : "";

    const theaterWithContent = [
      prefixLine,
      contentConfig.prefix,
      theaterRaw,
      contentConfig.suffix,
      suffixLine,
    ].join("");

    if (!spec["frame"]) {
      const context: RankiLangAstContext = {
        lang: this,
        blockDepth: spec.blockDepth,
        inlineDepth: spec.inlineDepth,
        theater: spec.theater,
        role: spec.role,
        startRule: spec.startRule,
      };
      return {
        report,
        theaters: {
          [spec.theater]: {
            stages: {
              raw: theaterWithContent,
              ast: ast(context, theaterWithContent),
            },
          },
        },
      };
    }

    switch (spec["frame"].version) {
      case "v1":
        return this.parseV1(
          theaterRaw,
          report,
          // TODO get rid of this type casting
          spec as RankiLangParseSpecsFrameV1,
        );

      case "v2":
        return this.parseV2(
          theaterRaw,
          report,
          // TODO get rid of this type casting
          spec as RankiLangParseSpecsFrameV2,
        );
    }
  }

  private parseV1(
    theaterRaw: string,
    report: RankiLangParseReport,
    spec: RankiLangParseSpecsFrameV1,
  ) {
    console.log("v1!!!", spec);
    const contextV1: RankiLangAstContext = {
      lang: this,
      blockDepth: spec.blockDepth,
      inlineDepth: spec.inlineDepth,
      theater: spec.theater,
      role: spec.role,
      startRule: spec.startRule,
    };
    return {
      report,
      theaters: {
        [spec.theater]: {
          stages: {
            raw: theaterRaw,
            ast: ast(contextV1, theaterRaw),
          },
        },
      },
    };
  }

  private parseV2(
    theaterRaw: string,
    report: RankiLangParseReport,
    spec: RankiLangParseSpecsFrameV2,
  ): RankiLangParseResult {
    console.log("v2!!!", spec);

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
      spec,
    );
    const lang = this.clone([directives]);
    const contextV2: RankiLangAstContext = {
      lang,
      blockDepth: spec.blockDepth,
      inlineDepth: spec.inlineDepth,
      theater: spec.theater,
      role: spec.role,
      startRule: spec.startRule,
    };

    const contentConfig = (lang as RankiLang).config.getAll().merged.content;
    const prefixLine =
      contentConfig.prefixLine !== "" ? contentConfig.prefixLine + "\n" : "";
    const suffixLine =
      contentConfig.suffixLine !== "" ? "\n" + contentConfig.suffixLine : "";

    const theaterWithContent = [
      prefixLine,
      contentConfig.prefix,
      theaterRaw,
      contentConfig.suffix,
      suffixLine,
    ].join("");
    console.log({ directives, settings, theaterWithContent });

    return {
      report,
      theaters: {
        [spec.theater]: {
          stages: {
            raw: theaterWithContent,
            ast: ast(contextV2, theaterWithContent),
          },
        },
      },
    };
  }
}

export interface ParseContext {
  config: RankiLanguageConfig;
  lang: RankiLang;
}
