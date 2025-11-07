import type {
  RankiLanguageProvidedConfig,
  ParserPluginsInstance,
  ComponentPluginsInstance,
  RankiLangParseDefinition,
  CreateParserReturn,
  RankiLangContextInstance,
  RankiLangParseFunctionReturn,
} from "@ranki/package-api-v2";
import { AstLibrary } from "../stages/ast/library.mjs";
import { RankiLangConfig } from "../config.mjs";
import type { RankiLangContext } from "./context.mjs";

interface RankiLangParserBoundaryHooks {
  ast: AstLibrary;
  components: ComponentPluginsInstance;
  parsers: ParserPluginsInstance;
  config: RankiLangConfig;
  context: RankiLangContext;
  parent: RankiLangParserBoundary | null;
}

export class RankiLangParserBoundary {
  private hooks: RankiLangParserBoundaryHooks;
  private config!: RankiLangConfig;
  private parser!: CreateParserReturn;
  private def: RankiLangParseDefinition;
  private provided: RankiLanguageProvidedConfig[];

  constructor(
    def: RankiLangParseDefinition,
    provided: RankiLanguageProvidedConfig[],
    hooks: RankiLangParserBoundaryHooks,
  ) {
    this.def = def;
    this.hooks = hooks;
    this.provided = [...provided];
  }

  parse(
    raw: string,
    context: RankiLangContextInstance,
  ): RankiLangParseFunctionReturn {
    const paramParser = this.hooks.parsers.find(this.def.type).paramParser;

    if (this.def.chain.length > 1) {
      throw new Error("MULTI LENGTH CHAINS NOT YET IMPLEMENTED");
    }
    const component = this.hooks.components.getPlugin(
      this.def.type,
      this.def.chain[0],
    );
    const props = paramParser(this.def, component.stages.ast);

    this.config = this.hooks.config.clone([
      ...this.provided,
      ...component.stages.ast.directives,
      ...props.config,
    ]);

    this.parser = this.hooks.ast.createParser(this.def, this.config);
    const merged = context.getMergedConfig();
    const preprocessed = component.stages.preprocess(raw);

    const theaterWithContent = [
      merged.content.prefix,
      preprocessed,
      merged.content.suffix,
    ].join("");

    const root = this.parser.callback(theaterWithContent, context);

    return {
      props: {
        ...root.props,
        ...props,
      },
      root: root.root,
    };
  }

  private getParent(): RankiLangParserBoundary | null {
    return this.hooks.parent;
  }

  getExpandedDefinition(): CreateParserReturn["expandedDefinition"] {
    if (!this.parser) {
      throw new Error("PARSER IS ONLY AVAILABLE AFTER PARSE IS CALLED");
    }
    return this.parser.expandedDefinition;
  }

  getLineage(): RankiLangParserBoundary[] {
    const lineage: RankiLangParserBoundary[] = [];
    let curr: RankiLangParserBoundary | null = this;
    while (curr) {
      lineage.push(curr);
      curr = curr.getParent();
    }
    return lineage;
  }

  getLineageHash() {
    return this.getLineage().map((p) => p.getExpandedDefinition()["hash"]);
  }

  getConfig() {
    return this.config;
  }
}
