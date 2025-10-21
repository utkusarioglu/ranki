import type {
  AstNode,
  RankiPluginParser,
  RankiPluginParserValidationFunc,
  RankiLangParseHandlerCommon,
  ValidatorFunctionEntry,
  ValidationNode,
  RankiLangAstContext,
} from "@ranki/package-api-v2";

export class ValidatorLibrary {
  private list: Record<string, ValidatorFunctionEntry> = {};

  addPlugin(plugin: RankiPluginParser) {
    Object.entries(plugin.validators()).forEach(([n, v]) => {
      const current = this.list[n];
      if (current) {
        throw new Error(
          `VALIDATOR ${n} ALREADY REGISTERED BY ${current.source}`,
        );
      }
      this.list[n] = {
        source: n,
        callback: v,
      };
    });
  }

  getValidator(name: string): RankiPluginParserValidationFunc {
    const found = this.list[name];
    if (!found) {
      throw new Error(`VALIDATOR ${name} NOT FOUND`);
    }
    return found.callback;
  }

  validate<T extends RankiLangParseHandlerCommon>(
    obj: AstNode,
    spec: RankiLangAstContext<T>,
  ): ValidationNode {
    try {
      const validator = this.getValidator(obj.creator);
      if (obj.kind === "parent") {
        const validation = validator(obj);
        return {
          validation,
          ...obj,
          children: obj.children.map((c) => this.validate(c, spec)),
        };
      } else {
        const validation = validator(obj);
        return {
          validation,
          ...obj,
        };
      }
    } catch (e) {
      console.error(obj, e);
      throw new Error(e.message);
    }
  }
}
