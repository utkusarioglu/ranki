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
  IId,
  Alias,
} from "@dqm/package-dqm-api-v2";
import { Id } from "../../id/id.mjs";
import { ParamsLib } from "../../libs/params/params-lib.mjs";
import { CommonTransports } from "../common-transports.mjs";
import { prepareContext } from "../ast/ast.utils.mjs";

const MERGE_TARGET = "merged";
// const CONFIG_CHANNEL = "configs";

export class Cps extends CommonTransports implements ICps {
  private id = new Id();
  private parent!: ICps;
  private component!: IDqmComponent;
  private paramsLib: IParams = new ParamsLib(this.getTransports());
  private cpx!: ICpx;

  constructor(params: CommonTransportsConstructorParams) {
    super(params);
    this.cloneConfig();
  }

  getId(): IId {
    return this.id;
  }

  setParent(cps: ICps): ICps {
    this.parent = cps;
    return this;
  }

  setDefinition(def: CpsDefinition): ICps {
    this.component = this.getPlugins().getComponentById(def.id);
    this.id.setId(this.component.meta.id.chain);
    if (def.id.length === 1) {
      this.id.setAlias(def.id as Alias);
    }
    this.paramsLib.setSchema(this.component.stages.ast);
    def.params.forEach((param) => {
      this.paramsLib.pushParam(param);
    });
    // TODO $ may not be the token the user prefers. or $ may be mapped to a value like "config"
    const componentParamConfig =
      this.paramsLib.getChannelCompilationByChannelName("settings");

    this.getConfig()
      .pushConfig("cps", componentParamConfig)
      .mergeTo(MERGE_TARGET);

    return this;
  }

  setCpx(cpx: ICpx): ICps {
    this.cpx = cpx;
    return this;
  }

  getCpx(): ICpx {
    return this.cpx;
  }

  getParent(): ICps {
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
