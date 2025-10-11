import type {
  RankiLanguageConfig,
  RankiLangInstance,
  RankiLangParseResult,
  RankiLangParseSpecs,
  RankiLangAstContext,
  RankiLanguageProvidedConfig,
  RankiLangParseReport,
  // RankiLangParseSpecsFrameV2,
  // RankiLangParseSpecsFrameV1,
} from "@ranki/package-api";
import { ast } from "./ast.mjs";
import { ParserPlugins } from "./parser-plugins.mjs";
import { RankiLangConfig } from "./config.mjs";
import { ComponentPlugins } from "./component-plugins.mjs";
// import { parseV2 } from "./parseV2.mjs";
// import { parseV1 } from "./parseV1.mjs";

export class RankiLang implements RankiLangInstance {
  private config: RankiLangConfig;
  public parsers: ParserPlugins;
  public components: ComponentPlugins;

  constructor(plugins: ParserPlugins, provided: RankiLanguageProvidedConfig[]) {
    this.parsers = plugins;
    this.config = new RankiLangConfig(plugins.produceConfig(), provided);
    this.components = new ComponentPlugins();
  }

  getConfig() {
    return this.config.getAll();
  }

  getPlugins() {
    return this.parsers;
  }

  private clone(
    providedConfigs: RankiLanguageProvidedConfig[] | null,
  ): RankiLangInstance {
    return new RankiLang(this.parsers, this.config.clone(providedConfigs));
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
        versions: this.parsers.getVersions(),
      },
      config: this.config.getAll(),
      theater: spec.theater,
      role: spec.role,
    };

    if (spec["plugin"]) {
      const handler = this.parsers.getHandler(spec["plugin"].type);
      return handler(
        theaterRaw,
        // report,
        // TODO get rid of this type casting
        spec,
        {
          lang: this,
          clone: this.clone.bind(this),
          // getComponents: this.components.get.bind(this.components),
          parseAst: ast,
        },
      );
      // switch (spec["plugin"].type) {
      //   case "RankiFrameV1":
      //     return parseV1(
      //       theaterRaw,
      //       // report,
      //       // TODO get rid of this type casting
      //       spec as RankiLangParseSpecsFrameV1,
      //       {
      //         lang: this,
      //         clone: this.clone.bind(this),
      //         // getComponents: this.components.get.bind(this.components),
      //         parseAst: ast,
      //       },
      //     );

      //   case "RankiFrameV2":
      //     return parseV2(
      //       theaterRaw,
      //       // report,
      //       // TODO get rid of this type casting
      //       spec as RankiLangParseSpecsFrameV2,
      //       {
      //         lang: this,
      //         clone: this.clone.bind(this),
      //         // getComponents: this.components.get.bind(this.components),
      //         parseAst: ast,
      //       },
      //     );
      // }
    } else {
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

    // throw new Error(
    //   `FOUND NO VIABLE METHOD FOR PARSING CONTENT:\n${theaterRaw}`,
    // );
  }
}

export interface ParseContext {
  config: RankiLanguageConfig;
  lang: RankiLang;
}
