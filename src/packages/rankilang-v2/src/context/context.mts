import type * as ohm from "ohm-js";
import type {
  ParserPluginsInstance,
  RankiLangContextInstance,
  RankiLangParseDefinition,
  ComponentPluginComponent,
  RankiLanguageConfig,
  AstNode,
  RankiLangContextParams,
  BindingNode,
  Enrichments,
  RankiLangParseFunctionReturn,
  RankiLanguageProvidedConfig,
  ValidationNode,
  TransformNode,
  ReducedTransformNode,
  ValidationNodeLeaf,
  AstNodeTransformerDefinition,
  ComponentChain,
  ComponentPluginTransformFunc,
  NodeDirection,
} from "@ranki/package-api-v2";
import { RankiLangParserBoundary } from "./parser-boundary.mjs";
import type { RankiLangContextHooks } from "./context.type.mjs";
import { assertTransformExists } from "@ranki/package-api-v2/helpers";

export class RankiLangContext implements RankiLangContextInstance {
  private parserBoundary!: RankiLangParserBoundary;
  private parserExpandedDefinition!: RankiLangParseDefinition;
  private direction!: NodeDirection;
  private provided: RankiLanguageProvidedConfig[] = [];
  private hooks: RankiLangContextHooks;
  private transformerDefinition!: AstNodeTransformerDefinition;

  private theater: RankiLangContextParams["theater"];
  private role: RankiLangContextParams["role"];

  private blockDepth: NonNullable<RankiLangContextParams["blockDepth"]>;
  private inlineDepth: NonNullable<RankiLangContextParams["inlineDepth"]>;
  private startRule: NonNullable<RankiLangContextParams["startRule"]>;
  private ohmNode: ohm.Node | null = null;

  constructor(
    p: RankiLangContextParams,
    hooks: RankiLangContextHooks,
    transfers?: {
      parserBoundary: RankiLangParserBoundary;
      parserExpandedDefinition: RankiLangParseDefinition;
      provided: RankiLanguageProvidedConfig[];
      transformerDefinition: AstNodeTransformerDefinition;
      direction: NodeDirection;
    },
  ) {
    this.theater = p.theater;
    this.role = p.role;
    this.blockDepth = p.blockDepth || 0;
    this.inlineDepth = p.inlineDepth || 0;
    this.startRule = p.startRule || "root";
    this.hooks = hooks;

    if (transfers) {
      this.parserBoundary = transfers.parserBoundary;
      this.parserExpandedDefinition = {
        ...transfers.parserExpandedDefinition,
        isBoundary: false,
      };
      this.direction = transfers.direction;
      this.transformerDefinition = {
        ...transfers.transformerDefinition,
        isBoundary: false,
      };
    }
  }

  setOhmNode(ohmNode: ohm.Node) {
    this.ohmNode = ohmNode;
  }

  setDirection(direction: NodeDirection): RankiLangContextInstance {
    this.direction = direction;
    return this;
  }

  getDirection(): NodeDirection {
    if (!this.direction) {
      console.log("ERROR AST NODE:\n", this);
      throw new Error("DIRECTION NOT DEFINED");
    }
    return this.direction;
  }

  newAstNode<P extends BindingNode, Output extends BindingNode>(
    p: P,
    en?: Enrichments,
  ): Output {
    if (!this.ohmNode) {
      throw new Error("AST NODE CREATION BEFORE OHM NODE REF ASSIGNMENT");
    }

    p.creator = this.ohmNode.ctorName;

    // const currentParser = this.getParserDefinition();
    // const lineage = this.parserBoundary.getLineageHash();
    // const props = this.getParserDefinition();

    p.context = this;

    p = {
      plugins: {
        parser: {
          current: this.parserExpandedDefinition,
          // lineage,
          // current: currentParser,
          // props,
        },
        grammars: {},
        transformer: this.transformerDefinition,
      },
      ...p,
    };

    if (p.shape) {
      p.shape = {
        ...this.getContextArgs(),
        ...p.shape,
        direction: this.getDirection(),
        hoist: en?.hoist || 0,
      };
    }

    if (!p.source) {
      p.source = {
        type: (en && en.sourceType) || "raw",
        raw: this.ohmNode.sourceString,
      };
    }

    if (!p.subtree) {
      p.subtree = {};
    }
    if (en && en.subtree) {
      Object.entries(en.subtree).forEach(([k, v]) => {
        v = { parent: p, ...v };
        // @ts-expect-error
        p.subtree[k] = v;
      });
    }

    if (en && en.children) {
      if (!p.children) {
        p.children = [];
      }
      en.children.forEach((i) => (i.parent = p));
      p.children.push(...en.children);
    }

    return p as unknown as Output;
  }

  newParserBoundary(
    def: Omit<RankiLangParseDefinition, "isBoundary">,
  ): RankiLangContextInstance {
    this.parserExpandedDefinition = {
      isBoundary: true,
      ...def,
    };
    return this;
  }

  newComponentBoundary(
    def: Omit<AstNodeTransformerDefinition, "isBoundary">,
  ): RankiLangContextInstance {
    this.transformerDefinition = {
      isBoundary: true,
      ...def,
    };
    return this;
  }

  useLineageBoundary(hoist: number): RankiLangContextInstance {
    const lineage = this.parserBoundary.getLineage();
    const boundary = lineage[lineage.length - hoist];
    if (hoist > lineage.length) {
      throw new Error(`HOIST NUMBER HIGHER THAN NESTED PARSERS`);
    }
    this.parserBoundary = boundary;
    this.parserExpandedDefinition = boundary.getExpandedDefinition();
    return this;
  }

  replaceProvidedConfig(
    provided: RankiLanguageProvidedConfig[] | RankiLanguageProvidedConfig,
  ): RankiLangContextInstance {
    if (Array.isArray(provided)) {
      this.provided = provided;
    } else {
      this.provided = [provided];
    }
    return this;
  }

  addProvidedConfig(
    provided: RankiLanguageProvidedConfig[] | RankiLanguageProvidedConfig,
  ): RankiLangContextInstance {
    if (Array.isArray(provided)) {
      this.provided.push(...provided);
    } else {
      this.provided.push(provided);
    }
    return this;
  }

  getParserDefinition(): RankiLangParseDefinition {
    return this.parserBoundary.getExpandedDefinition();
  }

  getPlugins: () => ParserPluginsInstance = () => this.hooks.parsers;

  getAllConfig: () => RankiLanguageConfig = (...all) =>
    this.parserBoundary.getConfig().getAll(...all);

  getComponent(
    handlerName: string,
    chain: ComponentChain,
  ): ComponentPluginComponent {
    return this.hooks.components.getPlugin(handlerName, chain);
  }

  parseAst(raw: string): RankiLangParseFunctionReturn {
    const parentParser = this.parserBoundary;
    if (this.parserExpandedDefinition === null) {
      throw new Error("METHOD CALLED BEFORE SETTING THE PARSER");
    }
    this.parserBoundary = new RankiLangParserBoundary(
      this.parserExpandedDefinition,
      this.provided,
      {
        ast: this.hooks.ast,
        components: this.hooks.components,
        parsers: this.hooks.parsers,
        config: this.hooks.config,
        context: this,
        parent: parentParser,
      },
    );
    return this.parserBoundary.parse(raw, this);
  }

  newTransformNode(
    v: ValidationNode,
    mamas: ReducedTransformNode[],
  ): TransformNode[] {
    let all: TransformNode[] = [];
    mamas.forEach((mama) => {
      switch (mama.kind) {
        case "leaf":
          const leafTn = {
            tag: mama.tag,
            kind: mama.kind,
            direction: mama.direction || v.shape.direction,
            hoist: mama.hoist || 0,
            print: (v as ValidationNodeLeaf).print || true,
            creator: v.creator,
            depth: v.shape.depth.total,
            source: mama.source,
            params: mama.params || v.plugins.transformer.params,
          };
          all.push(leafTn);
          break;
        case "parent":
          // all.push({
          //   ...mama,
          //   creator: v.creator,
          //   depth: v.shape.depth.total,
          //   params: mama.params || v.plugins.transformer.params,
          // });

          // break;

          const l1 = {
            tag: mama.tag,
            kind: mama.kind,
            hoist: mama.hoist || 0,
            direction: mama.direction || v.shape.direction,
            creator: v.creator,
            depth: v.shape.depth.total,
            // !FIX I'm pretty sure this is conceptually faulty
            params: mama.params || v.plugins.transformer.params,
            // params: mama.params || [],
          };

          const hasHoist = mama.children.filter(({ hoist }) => hoist).length;
          let l1Copy = { ...l1, children: [] as TransformNode[] };
          if (hasHoist) {
            mama.children.forEach((child) => {
              if (child.hoist) {
                child.hoist--;
                if (l1Copy.children.length) {
                  all.push({
                    ...l1Copy,
                    children: [...l1Copy.children],
                  });
                }
                l1Copy = { ...l1, children: [] as TransformNode[] };
                all.push(child);
              } else {
                l1Copy.children.push(child);
              }
            });
            if (l1Copy.children.length) {
              all.push(l1Copy);
            }
          } else {
            all.push({ ...l1, children: mama.children });
          }
      }
    });
    return all;
  }

  getStartRule(): string {
    return this.startRule;
  }

  newChild(
    ohmNode: ohm.Node,
    direction?: NodeDirection,
  ): RankiLangContextInstance {
    const blockDepth = this.blockDepth + (direction === "block" ? 1 : 0);
    const inlineDepth = this.inlineDepth + (direction === "inline" ? 1 : 0);
    // // TODO
    // this.direction = direction || "block";

    const inst = new RankiLangContext(
      {
        theater: this.theater,
        role: this.role,
        blockDepth,
        inlineDepth,
        startRule: this.startRule,
      },
      this.hooks,
      {
        parserExpandedDefinition: this.parserExpandedDefinition,
        parserBoundary: this.parserBoundary,
        transformerDefinition: this.transformerDefinition,
        provided: this.provided,
        direction: direction || this.direction,
      },
    );
    inst.setOhmNode(ohmNode);
    return inst;
  }

  getMergedConfig: () => RankiLanguageConfig["merged"] = () =>
    this.parserBoundary.getConfig().getMerged();

  getPluginConfig: (pluginName: string) => any = (pluginName: string) => {
    return this.parserBoundary.getConfig().getPluginConfig(pluginName);
  };

  parseValidation(ast: RankiLangParseFunctionReturn): ValidationNode | null {
    const merged = this.parserBoundary.getConfig().getMerged();
    const validation = ["validation", "transform"].includes(merged.stage)
      ? this.hooks.validators.validate(ast.root, this)
      : null;
    return validation;
  }

  parseTransform(
    validation: ValidationNode[] | ValidationNode | null,
  ): TransformNode[] | null {
    if (validation === null) {
      return null;
    }
    const singleTransform = (validation: ValidationNode): TransformNode[] => {
      const transformer = this.hooks.components.getTransformer(validation);
      return transformer(validation);
    };

    if (Array.isArray(validation)) {
      const children: TransformNode[] = [];
      validation.forEach((c) => {
        const transformed = singleTransform(c);
        assertTransformExists(transformed);
        children.push(...transformed);
      });
      return children;
    } else {
      return singleTransform(validation);
    }
  }

  getTransformer(v: ValidationNode): ComponentPluginTransformFunc {
    return this.hooks.components.getTransformer(v);
  }

  private getContextArgs(): Pick<AstNode["shape"], "depth"> {
    return {
      depth: {
        block: this.blockDepth,
        inline: this.inlineDepth,
        total: this.blockDepth + this.inlineDepth,
      },
    };
  }
}
