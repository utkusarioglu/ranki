import type {
  ICps,
  IDqmComponent,
  IParams,
  ICpx,
  CpxParseInput,
  CpsDefinition,
  IAstNode,
  CommonTransportsConstructorParams,
  DqmConfig,
  Alias,
  IParam,
  Chain,
  IdString,
  AliasString,
  ChainString,
} from "@dqm/package-dqm-api-v2";
import { Id } from "../../id/id.mjs";
import { ParamsLib } from "../../libs/params/params-lib.mjs";
import { CommonTransports } from "../common-transports.mjs";
import { prepareContext } from "../ast/ast.utils.mjs";
import { INITIAL_CONFIG_NAME } from "../../constants.mjs";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";

const MERGE_TARGET = "merged";
const CONFIG_CHANNEL = "configs";

export class Cps extends CommonTransports implements ICps {
  private id = new Id();
  private parent: ICps | null = null;
  private prev: ICps | null = null;
  private next: ICps | null = null;
  private children: ICps[] = [];
  private component!: IDqmComponent;
  private paramsLib: IParams = new ParamsLib(this.getTransports());
  private cpx!: ICpx;
  private onFailMode = false;

  constructor(params: CommonTransportsConstructorParams) {
    super(params);
    this.cloneConfig();
  }

  getParams(): IParam[] {
    return this.paramsLib.getParams();
  }

  setPrev(prev: ICps): this {
    this.prev = prev;
    return this;
  }

  setNext(next: ICps): this {
    this.next = next;
    return this;
  }

  getPrev(): ICps | null {
    return this.prev;
  }

  getNext(): ICps | null {
    return this.next;
  }

  getId(): Alias | Chain {
    return this.id.getId();
  }

  getIdString(): IdString {
    return this.id.getIdString();
  }

  getAlias(): Alias | undefined {
    return this.id.getAlias();
  }

  getAliasString(): AliasString {
    return this.id.getAliasString();
  }

  getChain(): Chain {
    return this.id.getChain();
  }

  getChainString(): ChainString {
    return this.id.getChainString();
  }

  getOnFailMode() {
    return this.onFailMode;
  }

  setParent(cps: ICps): this {
    this.parent = cps;
    if (this.parent) {
      this.parent.pushChild(this);
    }
    return this;
  }

  pushChild(child: ICps): this {
    this.children.push(child);
    return this;
  }

  getChildren(): ICps[] {
    return this.children;
  }

  private setToFailMode() {
    this.onFailMode = true;
  }

  /**
   * @dev
   * #1 Note that initial component cannot be overwritten
   * #2 TODO a warning should be issued if a component fails
   */
  private determineComponent(def: CpsDefinition): void {
    try {
      this.component = this.getPlugins().getComponentById(def.id);
    } catch (e) {
      const initial =
        this.getConfig().getConfig<DqmConfig>(INITIAL_CONFIG_NAME);
      switch (initial.plugins.onAbsentComponent) {
        case "useDefaultComponent":
          this.setToFailMode();
          // #1 #2
          const { chain } = initial.plugins.defaultComponent;
          this.component = this.getPlugins().getComponentById(chain);
          break;
        default:
          throw new DqmAppError({
            code: "DEPENDENCY_ABSENT",
            why: "Source requested a component that wasn't installed by any of the plugins",
            cause: e,
            details: {
              def,
              INITIAL_CONFIG_NAME,
              config: this.getConfig(),
            },
          });
      }
    }
  }

  setDefinition(def: CpsDefinition): this {
    this.determineComponent(def);
    this.id.setId(this.component.meta.id.chain);
    if (def.id.length === 1) {
      this.id.setAlias(def.id as Alias);
    }
    this.paramsLib.setSchema(this.component.stages.ast);
    if (!this.getOnFailMode()) {
      def.params.forEach((param) => {
        this.paramsLib.pushParam(param);
      });
      // TODO $ may not be the token the user prefers. or $ may be mapped to a value like "config"
      const componentParamConfig =
        this.paramsLib.getChannelCompilationByChannelName(CONFIG_CHANNEL);

      this.getConfig()
        .pushConfig("cps", componentParamConfig)
        .mergeTo(MERGE_TARGET);
    } else {
      this.getConfig().mergeTo(MERGE_TARGET);
    }

    return this;
  }

  setCpx(cpx: ICpx): this {
    this.cpx = cpx;
    return this;
  }

  getCpx(): ICpx {
    return this.cpx;
  }

  getParent(): ICps | null {
    return this.parent;
  }

  parse(input: CpxParseInput): IAstNode {
    const activeConfig = this.getConfig().getConfig<DqmConfig>(MERGE_TARGET);
    // TODO
    const { parse } = this.getPlugins().getParser(
      "NOT_SURE_IF_THIS_IS_NEEDED",
      activeConfig,
    );
    const obj = parse(
      input.dqm,
      // TODO this likely will come from the `direction` property of some ast
      // node
      "baseV2RootBlock",
      prepareContext(this.cpx.getRootAst()),
    );
    return obj.root;
  }
}
