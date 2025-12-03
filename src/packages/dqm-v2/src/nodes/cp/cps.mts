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
} from "@dqm/package-dqm-api-v2";
import { Id } from "../../id/id.mjs";
import { Params } from "../param/params.mjs";
import { CommonTransports } from "../common-transports.mjs";

const MERGE_TARGET = "merged";

export class Cps extends CommonTransports implements ICps {
  private id = new Id();
  private parent!: ICps;
  private component!: IDqmComponent;
  private params: IParams = new Params(this.getTransports());
  private cpx!: ICpx;

  constructor(params: CommonTransportsConstructorParams) {
    super(params);
    this.cloneConfig();
  }

  setParent(cps: ICps): ICps {
    this.parent = cps;
    return this;
  }

  setDefinition(def: CpsDefinition): ICps {
    this.id.setId(def.id);
    this.component = this.getPlugins().getComponent(def.id);
    this.params.setSchema(this.component.stages.ast);
    def.params.forEach((param) => {
      this.params.pushParam(param);
    });
    // TODO $ may not be the token the user prefers. or $ may be mapped to a value like "config"
    this.getConfig()
      .pushConfig("cps", this.params.buildObject("config"))
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
    console.log({ order: this.getConfig().getOrder() });
    // TODO
    const { parse } = this.getPlugins().getParser(
      "NOT_SURE_IF_THIS_IS_NEEDED",
      activeConfig,
    );
    // TODO
    const ast = this.cpx.getRootAst();
    const obj = parse(
      input.inputs[input.theater],
      // TODO this likely will come from the `direction` property of some ast
      // node
      "baseV2RootBlock",
      {
        // cpx: this.cpx,
        // cps: this,
        ast,
      },
    );
    return obj.root;
  }
}
