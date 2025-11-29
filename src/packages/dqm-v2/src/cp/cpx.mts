import type {
  ICpx,
  IPlugins,
  IConfig,
  CpxParseInput,
  IParam,
  IdList,
  ICps,
  Audience,
} from "@ranki/package-dqm-api-v2";
import { DqmError } from "@ranki/package-utils";
import { dependsOn, nonNullable } from "../decorators.mjs";
import { ALL_AUDIENCES } from "./param/param.constants.mjs";
import { Cps } from "./cps.mjs";

export class Cpx implements ICpx {
  private parent!: ICpx;
  private config!: IConfig;
  private plugins!: IPlugins;
  private params!: IParam[];
  private cps: ICps[] = [];

  hookPlugins(plugins: IPlugins): ICpx {
    this.plugins = plugins;
    return this;
  }

  setParams(params: IParam[]) {
    // TODO this only sets the values from the component specification
    // the default config could also define some values for components
    // this.params.setSchema(this.component.stages.ast);
    // params.forEach((param) => {
    //   this.params.addParam(param);
    // });
    this.params = params;
    return this;
  }

  @dependsOn("params")
  getParams(audience: Audience): IParam[] {
    return this.params.filter((p) =>
      [ALL_AUDIENCES, audience].includes(p.getAudience()),
    );
  }

  hookConfig(config: IConfig): ICpx {
    this.config = config;
    return this;
  }

  @dependsOn("parent", "plugins")
  newChild() {
    console.log(this.parent, this.config);
    return new Cpx()
      .setParent(this)
      .hookPlugins(this.plugins)
      .hookConfig(this.config);
  }

  setParent(parent: ICpx) {
    this.parent = parent;
    return this;
  }

  @nonNullable
  getParent(): ICpx {
    return this.parent;
  }

  setIdList(idList: IdList): ICpx {
    const createRoot = () => {
      return new Cps()
        .setId(idList[0])
        .setParams(this.getParams(0))
        .setParent(this.getParent().getLeafCps())
        .hookConfig(this.config)
        .setCpx(this)
        .setPlugins(this.plugins);
    };

    switch (idList.length) {
      case 0:
        throw new DqmError("CHAIN_LIST_EMPTY", { cpx: this });
      case 1:
        this.cps.push(createRoot());
        return this;
      default:
        let curr = createRoot();
        this.cps.push(curr);
        for (let i = 1; i < idList.length; i++) {
          const prev = curr;
          curr = new Cps()
            .setId(idList[i])
            .setParams(this.getParams(i))
            .hookConfig(this.config)
            .setCpx(this)
            .setParent(prev)
            .setPlugins(this.plugins);
          this.cps.push(curr);
        }
        return this;
    }
  }

  @nonNullable
  getLeafCps(): ICps {
    return this.cps.at(-1)!;
  }

  @nonNullable
  getRootCps(): ICps {
    return this.cps[0];
  }

  parse(input: CpxParseInput): ICpx {
    console.log("input", input);
    this.getRootCps().parse(input);
    return this;
  }
}
