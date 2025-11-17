import type {
  RankiLanguageConfig,
  RankiLanguageProvidedConfig,
} from "./config.type.mjs";
import type {
  AstNode,
  AstNodeLeaf,
  AstNodeLeafSource,
  AstNodeTransformerDefinition,
  NodeDirection,
} from "../stages/ast.type.mjs";
import type { RankiLangInstance } from "./rankilang.type.mjs";
import type { RankiPluginParser } from "../plugins/parser.type.mjs";
import type { RankiGrammarTokens } from "../plugins/grammar.type.mjs";
import type * as ohm from "ohm-js";
import type {
  TransformNode,
  TransformNodeLeaf,
  TransformNodeParent,
} from "../stages/transform.type.mjs";
import type { ValidationNode } from "../stages/validation.type.mjs";
import type {
  ComponentChain,
  ComponentPluginComponent,
} from "../export.type.mjs";

export interface RankiLangParseResult {
  report: RankiLangParseReport;
  theaters: {
    [key: string]: RankiLangParsedTheater;
  };
}

export interface RankiLangAstResult {
  theaters: {
    [key: string]: RankiLangParsedTheater;
  };
}

export type RankiLangAstResultTheaters = Record<string, RankiLangParsedTheater>;

export interface RankiLangParseReport {
  language: {
    versions: VersionReport;
  };
  ast: RankiLangConsolidatedAstReport;
  theater: TheaterName;
  role: RoleName;
}

export interface RankiLangConsolidatedAstReport {
  count: number;
  list: RankiLangAstReport[];
}

// export type RankiLangParsedAst = RankiLangParseFunctionReturn;

export interface RankiLangParsedTheater {
  stages: {
    raw: string;
    ast: RankiLangParseFunctionReturn;
    validation: ValidationNode | null;
    transform: TransformNode[] | null;
  };
}

export interface RankiLangAstReport {
  cache: {
    hash: string;
    usageCount: number;
  };
  graph: {
    requested: string[];
    sorted: string[];
    dependencies: Record<string, string[]>;
    contributors: Record<string, string[]>;
    methods: Record<string, string[]>;
  };
  grammar: {
    source: string;
  };
  config: RankiLanguageConfig;
}

export interface RankiLangParseFunctionReturn {
  props: Record<string, any>;
  root: AstNode;
}

export type ProducedConfig = {
  config: Record<string, unknown>;
  tokens: Record<string, RankiGrammarTokens>;
};

export type ActionsDictRecord = Record<
  string,
  Record<string, ohm.ActionDict<any>>
>;

export interface ParserPluginsInstance {
  addPlugin(p: RankiPluginParser): void;
  getVersions(): VersionReport;
  produceConfig(): ProducedConfig;
  // getHandler(def: RankiLangParseDefinition): RankiLangParseHandlerFunction;
  checkMissing(set: Set<string>): string[];
  pickPlugins(set: Set<string>): RankiPluginParser[];
  sortPlugins(activePluginsArr: RankiPluginParser[]): string[];
  dependencyGraph(
    activePluginsArr: RankiPluginParser[],
  ): Record<
    RankiPluginParser["meta"]["name"],
    RankiPluginParser["meta"]["name"][]
  >;
  getActions(): ActionsDictRecord;
  find(name: string): RankiPluginParser;
}

export type TheaterName = string & { type?: "TheaterName" };
type RoleName = string & { type?: "RoleName" };

export type GenericParamOperators = "assign" | "append" | "remove";

// !fix export from args and params is renderer irrelevant because
// `GenericParam` now also supports "positional"
// remove those types
export interface GenericParam {
  type: string;
  key: string[] | "positional";
  shape: AstNode["shape"];
  operator: GenericParamOperators;
  values: { type: string; raw: string }[];
  source: AstNodeLeafSource;
}

export interface RankiLangParseDefinition {
  isBoundary: boolean;
  type: string;
  chainList: ComponentChain[];
  params: GenericParam[];
}

export type RankiLangParseSpecs = {
  theater: TheaterName;
  role: RoleName;
};

export type RankiLangContextParams = RankiLangParseSpecs & {
  blockDepth?: number;
  inlineDepth?: number;
  startRule?: string;
};

export type RankiLangAstContext = RankiLangContextInstance;

type TransformNodeParentRequired = "kind" | "tag" | "children";
type TransformNodeLeafRequired = "kind" | "tag" | "source";

export type ReducedTransformNode =
  | ReducedTransformNodeParent
  | ReducedTransformNodeLeaf;
// Pick<TransformNode, TransformNodeRequired> &
// Partial<Omit<TransformNode, TransformNodeRequired>>;

// type ReducedTransformNodeHoist = {
//   hoist: number;
// };

export type ReducedTransformNodeParent = Pick<
  TransformNodeParent,
  TransformNodeParentRequired
> &
  Partial<Omit<TransformNodeParent, TransformNodeParentRequired>>;
// & ReducedTransformNodeHoist;

export type ReducedTransformNodeLeaf = Pick<
  TransformNodeLeaf,
  TransformNodeLeafRequired
> &
  Partial<Omit<TransformNodeLeaf, TransformNodeLeafRequired>>;
// & ReducedTransformNodeHoist;

export interface RankiLangContextInstance {
  getPlugins: RankiLangInstance["getPlugins"];
  // getHandler: ParserPluginsInstance["getHandler"];
  getAllConfig: () => RankiLanguageConfig;
  getMergedConfig: () => RankiLanguageConfig["merged"];
  getPluginConfig: <T>(pluginName: string) => T;
  setDirection(direction: NodeDirection): RankiLangContextInstance;
  getDirection(): NodeDirection;

  getComponent(
    handlerName: string,
    chain: ComponentChain,
  ): ComponentPluginComponent;
  parseAst: (raw: string) => RankiLangParseFunctionReturn;
  parseValidation(ast: RankiLangParseFunctionReturn): ValidationNode | null;
  parseTransform(
    validation: ValidationNode[] | ValidationNode | null,
  ): TransformNode[] | null;

  newTransformNode(
    v: ValidationNode,
    reducedTransformNode: ReducedTransformNode[],
  ): TransformNode[];
  newChild(
    self: ohm.Node,
    direction?: "block" | "inline",
  ): RankiLangContextInstance;

  newParserBoundary(
    def: Omit<RankiLangParseDefinition, "isBoundary">,
  ): RankiLangContextInstance;
  useLineageBoundary(hoist: number): RankiLangContextInstance;

  newComponentBoundary(
    def: Omit<AstNodeTransformerDefinition, "isBoundary">,
  ): RankiLangContextInstance;

  replaceProvidedConfig(
    provided: RankiLanguageProvidedConfig[],
  ): RankiLangContextInstance;
  addProvidedConfig(
    provided: RankiLanguageProvidedConfig[],
  ): RankiLangContextInstance;
  getParserDefinition(): RankiLangParseDefinition;

  getStartRule(): string;

  newAstNode<P extends BindingNode, Output extends BindingNode>(
    p: P,
    en?: Enrichments,
  ): Output;

  // getTransformer(
  //   v: ValidationNode,
  //   // chain: ComponentChain,
  //   // creator: string,
  // ): ComponentPluginTransformFunc;
}

export interface Enrichments {
  children?: BindingNode[];
  subtree?: Record<string, BindingNode>;
  sourceType?: AstNodeLeaf["source"]["raw"];
  transformer?: NonNullable<AstNode["plugins"]["transformer"]>;
  hoist?: number;
}

export interface BindingNode {
  context?: RankiLangContextInstance;
  creator?: string;
  shape?: Record<string, any>;
  parent?: BindingNode;
  children?: BindingNode[];
  plugins?: Record<string, any>;
  subtree?: Record<string, BindingNode>;
  source?: {
    type: string;
    raw: string;
  };
}

export type VersionReport = Record<string, string>;
