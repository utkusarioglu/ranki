import type {
  AstNode,
  RankiPluginParser,
  ParserValidatorFunctionEntry,
  ValidationNode,
  ValidationNodeParent,
  ValidationNodeLeaf,
  RankiPluginComponent,
  ComponentValidationFuncEntry,
  RankiLangContextInstance,
  ComponentChainString,
} from "@ranki/package-api-v2";

const CODE_SEPARATOR = ":";

export class ValidatorLibrary {
  private parsers: Record<string, ParserValidatorFunctionEntry> = {};
  private components: Record<string, ComponentValidationFuncEntry> = {};

  getLists() {
    return {
      parsers: this.parsers,
      components: this.components,
    };
  }

  addParser(plugin: RankiPluginParser): void {
    Object.entries(plugin.validators()).forEach(([source, validate]) => {
      const current = this.parsers[source];
      if (current) {
        throw new Error(
          `PARSER VALIDATOR ${source} ALREADY REGISTERED BY ${current.source}`,
        );
      }
      this.parsers[source] = {
        source,
        validate,
      };
    });
  }

  addComponent(component: RankiPluginComponent): void {
    // TODO I don't like the fact that `source` is handler here but it's `type` in the frameConfig object
    const source = component.handler;
    component.list.forEach(({ chain, stages }) => {
      const chainStr: ComponentChainString = chain.join(".");
      const code = [source, chainStr].join(CODE_SEPARATOR);
      const current = this.parsers[chainStr];
      if (current) {
        throw new Error(
          `COMPONENT VALIDATOR ${chain} ALREADY REGISTERED BY ${current.source}`,
        );
      }
      const validate = stages.validator;
      this.components[code] = {
        source,
        chain,
        code,
        validate,
      };
    });
  }

  getParserValidator(obj: AstNode): ParserValidatorFunctionEntry {
    const source = obj.creator;
    const parser = this.parsers[obj.creator];
    if (!parser) {
      return {
        source,
        validate: () => ({
          errors: [],
          warnings: ["NO_PARSER_VALIDATOR"],
        }),
      };
    }
    return parser;
  }

  getComponentValidator(obj: ValidationNode): ComponentValidationFuncEntry {
    // TODO
    // @ts-expect-error
    const current = obj.plugins.parser.current;
    if (!current) {
      throw new Error("VALIDATION NODE LACKS INFORMATION ABOUT CURRENT PARSER");
    }

    const source = current.type;
    const chain = current.chain;
    const code = [source, chain].join(CODE_SEPARATOR);
    const component = this.components[code];

    if (!component) {
      return {
        source,
        code,
        chain,
        validate: () => ({
          errors: [],
          warnings: ["NO_COMPONENT_VALIDATOR"],
        }),
      };
    }
    return component;
  }

  // TODO i'm not sure whether the `spec` is actually needed in this method
  validate(
    astNode: AstNode,
    context: RankiLangContextInstance,
  ): ValidationNode {
    try {
      const parserValidator = this.getParserValidator(astNode);
      if (astNode.kind === "parent") {
        const subtree = astNode.subtree
          ? Object.entries(astNode.subtree).reduce(
              (a, [name, c]) => (
                (a[name] = this.validate(c as AstNode, context)), a
              ),
              {} as Record<string, ValidationNode>,
            )
          : {};

        const validated = {
          validation: {
            errors: [],
            warnings: [],
          },
          ...astNode,
          subtree,
          children: astNode.children.map((c) => this.validate(c, context)),
        } as ValidationNodeParent;

        const parserValidatorResult = parserValidator.validate(astNode);
        validated.validation.errors.push(
          ...parserValidatorResult.errors.map((entry) => ({
            source: parserValidator.source,
            entry,
          })),
        );
        validated.validation.warnings.push(
          ...parserValidatorResult.warnings.map((entry) => ({
            source: parserValidator.source,
            entry,
          })),
        );
        const componentValidator = this.getComponentValidator(validated);

        const componentValidatorResult = componentValidator.validate(validated);

        validated.validation.errors.push(
          ...componentValidatorResult.errors.map((entry) => ({
            source: componentValidator.code,
            entry,
          })),
        );
        validated.validation.warnings.push(
          ...componentValidatorResult.warnings.map((entry) => ({
            source: componentValidator.code,
            entry,
          })),
        );

        return validated;
      } else {
        const validated = {
          validation: {
            errors: [],
            warnings: [],
          },
          ...astNode,
        } as ValidationNodeLeaf;

        const parserValidatorResult = parserValidator.validate(astNode);
        validated.validation.errors.push(
          ...parserValidatorResult.errors.map((entry) => ({
            source: parserValidator.source,
            entry,
          })),
        );
        validated.validation.warnings.push(
          ...parserValidatorResult.warnings.map((entry) => ({
            source: parserValidator.source,
            entry,
          })),
        );
        const componentValidator = this.getComponentValidator(validated);

        const componentValidatorResult = componentValidator.validate(validated);

        validated.validation.errors.push(
          ...componentValidatorResult.errors.map((entry) => ({
            source: componentValidator.code,
            entry,
          })),
        );
        validated.validation.warnings.push(
          ...componentValidatorResult.warnings.map((entry) => ({
            source: componentValidator.code,
            entry,
          })),
        );

        return validated;
      }
    } catch (e: unknown) {
      console.error(astNode, e);
      throw new Error((e as Error).message);
    }
  }
}
