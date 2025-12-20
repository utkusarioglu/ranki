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

  constructor(params: CommonTransportsConstructorParams) {
    super(params);
    this.cloneConfig();
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

  getId(): IId {
    return this.id;
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

  setDefinition(def: CpsDefinition): this {
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
      this.paramsLib.getChannelCompilationByChannelName(CONFIG_CHANNEL);

    this.getConfig()
      .pushConfig("cps", componentParamConfig)
      .mergeTo(MERGE_TARGET);

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
