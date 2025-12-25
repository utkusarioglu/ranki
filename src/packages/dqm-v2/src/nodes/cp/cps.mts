import type {
  ICps,
  IDqmComponent,
  IParams,
  CpxParseInput,
  CpsDefinition,
  IAstNode,
  CommonTransportsConstructorParams,
  DqmConfig,
  Alias,
  IAstParamNode,
} from "@dqm/package-dqm-api-v2";
import { ParamsLib } from "../../libs/params/params-lib.mjs";
import { CommonTransports } from "../common-transports.mjs";
import { prepareContext } from "../ast/base/ast.utils.mjs";
import { INITIAL_CONFIG_NAME } from "../../constants.mjs";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";
import { idCapability } from "../capabilities/id.cap.mjs";
import { verticesCapability } from "../capabilities/vertices.capability.mjs";
import { cpxCollection } from "./capabilities/cpx-collection.cap.mjs";

const MERGE_TARGET = "merged";
const CONFIG_CHANNEL = "configs";

export class Cps extends CommonTransports implements ICps {
  private id = idCapability(this);
  private vertices = verticesCapability<this, ICps>(this);
  private cpx = cpxCollection(this);
  private component!: IDqmComponent;
  private paramsLib: IParams = new ParamsLib(this.getTransports());
  private onFailMode = false;

  constructor(params: CommonTransportsConstructorParams) {
    super(params);
    this.cloneConfig();
  }

  getParams(): IAstParamNode[] {
    return this.paramsLib.getParams();
  }

  private setToFailMode() {
    this.onFailMode = true;
  }

  getOnFailMode() {
    return this.onFailMode;
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
      prepareContext(this.getCpx().getRootAst()),
    );
    return obj.root;
  }

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
