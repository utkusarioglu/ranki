import type {
  ICps,
  IDqmComponent,
  IParams,
  CpxParseInput,
  CpsDefinition,
  IAstNode,
  Alias,
  ICpsParam,
  CommonTransportsConstructorParams,
  Chain,
  DqmInternalConfig,
  ITCpsNode,
} from "@dqm/package-dqm-api-v2";
import { ParamsLib } from "./params/params-lib.mjs";
import { CommonTransports } from "../../common-transports.mjs";
import { prepareContext } from "../../ast/base/ast.utils.mjs";
import { INITIAL_CONFIG_NAME } from "../../../constants.mjs";
import { DqmAppError } from "../../../errors/dqm-app-error/dqm-app-error.mjs";
import { idCapability } from "../../capabilities/id.cap.mjs";
import { verticesCapability } from "../../capabilities/vertices.capability.mjs";
import { cpxCollection } from "../capabilities/cpx-collection.cap.mjs";
import { assertNever } from "../../../errors/dqm-app-error/assertions.mjs";

export class Cps extends CommonTransports implements ICps {
  private id = idCapability(this);
  private vertices = verticesCapability<this, ICps>(this);
  private cpx = cpxCollection(this);
  private component!: IDqmComponent;
  private customizations: IParams = new ParamsLib(this.getTransports());
  private onFailMode = false;
  private intendedId!: Chain | Alias;
  private settledId: Chain | Alias | null = null;
  private trnCpsRootNode: ITCpsNode | null = null;

  constructor(params: CommonTransportsConstructorParams) {
    super(params);
    this.customizations.initConfig(this.getUnique());
  }

  setTCpsRootNode(n: ITCpsNode): this {
    this.trnCpsRootNode = n;
    return this;
  }

  getTCpsRootNode(): ITCpsNode | null {
    return this.trnCpsRootNode;
  }

  validate(): void {
    this.getChildren().forEach((c) => c.validate());
    this.component.validation.forEach((v) => v(this));
  }

  getIntendedId(): Chain | Alias {
    return this.intendedId;
  }

  getSettledId(): Chain | Alias | null {
    return this.settledId;
  }

  getParams(): ICpsParam[] {
    return this.customizations.getParams();
  }

  private setToFailMode() {
    this.onFailMode = true;
  }

  isOnFailMode() {
    return this.onFailMode;
  }

  /**
   * @dev
   * #1 Note that initial component cannot be overwritten
   * #2 TODO a warning should be issued if a component fails
   */
  private setFailModeComponent(error: unknown, def: CpsDefinition) {
    // const initial = this.getConfig().getConfig<DqmConfig>(INITIAL_CONFIG_NAME);
    const initial = this.getInitialConfig();
    // #1 #2
    const { chain } = initial.plugins.fallback;
    try {
      switch (initial.plugins.onAbsentComponent) {
        case "useDefaultComponent":
          this.setToFailMode();
          this.component = this.getPlugins().getComponentById(chain);
          this.settledId = chain;
          break;
        case "fail":
          throw new DqmAppError({
            code: "DEPENDENCY_ABSENT",
            why: "Source requested a component that wasn't installed by any of the plugins",
            cause: error,
            details: {
              def,
              INITIAL_CONFIG_NAME,
              initialConfig: initial,
            },
          });
        default:
          assertNever({
            why: "All possible absent component options should have been depleted",
          });
      }
    } catch (e) {
      throw new DqmAppError({
        code: "DEFAULT_COMPONENT_FAILURE",
        why: "Fail mode tried to set up the default component for the Cps but this operation also failed.",
        cause: e,
        details: { def, chain, initialConfig: initial },
      });
    }
  }

  private determineComponent(def: CpsDefinition): void {
    this.intendedId = def.id;
    try {
      this.component = this.getPlugins().getComponentById(def.id);
      this.settledId = this.intendedId;
    } catch (e) {
      this.setFailModeComponent(e, def);
    }
  }

  setDefinition(def: CpsDefinition): this {
    this.determineComponent(def);
    this.id.setId(this.component.meta.id.chain);
    if (def.id.length === 1) {
      this.id.setAlias(def.id as Alias);
    }
    this.customizations.setSchema(this.component.customizations);
    if (this.isOnFailMode()) {
      return this;
    }
    def.params.forEach((param) => {
      this.customizations.pushParam(param);
    });
    return this;
  }

  parse(input: CpxParseInput): IAstNode {
    const config = this.isOnFailMode()
      ? this.getInitialConfig()
      : this.customizations.getParsedDqmConfig();
    const tokens = this.getPlugins().getTokens(config);
    const internal: DqmInternalConfig = {
      ...config,
      grammar: {
        tokens,
      },
    };
    // TODO
    const parser = this.getPlugins().getParser(internal);
    const prefix = config.content.prefix;
    const suffix = config.content.suffix;
    const trimmed = config.content.trim ? input.dqm.trim() : input.dqm;
    const prefixed = [prefix, trimmed, suffix].join("");
    const parsed = parser.parse(
      prefixed,
      // TODO this likely will come from the `direction` property of some ast
      // node
      "baseV2RootBlock",
      prepareContext(this.getCpx().getRootAst()),
    );
    return parsed.root;
  }

  // CUSTOMIZATIONS
  getChannels = this.customizations.getChannelNames.bind(this.customizations);
  getDqmConfig = this.customizations.getParsedDqmConfig.bind(
    this.customizations,
  );
  getComponentConfig = this.customizations.getParsedComponentConfig.bind(
    this.customizations,
  );

  // ID
  setAlias = this.id.setAlias;
  getAlias = this.id.getAlias;
  getAliasString = this.id.getAliasString;
  setPosition = this.id.setPosition;
  getId = this.id.getId;
  setId = this.id.setId;
  getIdString = this.id.getIdString;
  getChain = this.id.getChain;
  getChainString = this.id.getChainString;

  // VERTICES
  setParent = this.vertices.setParent.bind(this.vertices);
  getParent = this.vertices.getParent.bind(this.vertices);
  getNext = this.vertices.getNext.bind(this.vertices);
  getPrev = this.vertices.getPrev.bind(this.vertices);
  setPrev = this.vertices.setPrev.bind(this.vertices);
  setNext = this.vertices.setNext.bind(this.vertices);
  getChildren = this.vertices.getChildren.bind(this.vertices);
  pushChild = this.vertices.pushChild.bind(this.vertices);

  // CPX
  getCpx = this.cpx.getCpx.bind(this.cpx);
  setCpx = this.cpx.setCpx.bind(this.cpx);
}
