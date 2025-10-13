import type {
  AstNode,
  RankiPluginParser,
  RankiPluginParserValidationFunc,
  RankiLangParseSpecs,
  RankiLangParseHandlerCommon,
  ValidatorFunctionEntry,
  ValidationNode,
} from "@ranki/package-api-v2";

export class ValidatorLibrary {
  private validators: Record<string, ValidatorFunctionEntry> = {};

  addPlugin(plugin: RankiPluginParser) {
    console.log({ plugin });
    Object.entries(plugin.validations()).forEach(([n, v]) => {
      const current = this.validators[n];
      if (current) {
        throw new Error(
          `VALIDATOR ${n} ALREADY REGISTERED BY ${current.source}`,
        );
      }
      this.validators[n] = {
        source: n,
        callback: v,
      };
    });
  }

  getValidator(name: string): RankiPluginParserValidationFunc {
    console.log(this.validators);
    const found = this.validators[name];
    if (!found) {
      throw new Error(`VALIDATOR ${name} NOT FOUND`);
    }
    return found.callback;
  }

  validate<T extends RankiLangParseHandlerCommon>(
    obj: AstNode,
    spec: RankiLangParseSpecs<T>,
  ): ValidationNode {
    const validator = this.getValidator(obj.type);
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
  }
}
