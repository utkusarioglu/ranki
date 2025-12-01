import type {
  ICpx,
  IPlugins,
  IConfig,
  CpxParseInput,
  IParam,
  IdList,
  ICps,
  Audience,
  IAstNode,
} from "@dqm/package-dqm-api-v2";
import { DqmError } from "@dqm/package-utils";
import { dependsOn, rejectValues } from "../utils/decorators.mjs";
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
  getParamsByAudience(audience: Audience): IParam[] {
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
    return new Cpx()
      .setParent(this)
      .hookPlugins(this.plugins)
      .hookConfig(this.config);
  }

  setParent(parent: ICpx) {
    this.parent = parent;
    return this;
  }

  getParent(): ICpx {
    return this.parent;
  }

  @dependsOn("params")
  setIdList(idList: IdList): ICpx {
    const createRoot = () => {
      const parentCpx = this.getParent();
      const parentCps = parentCpx ? parentCpx.getLeafCps() : null;
      return new Cps()
        .hookConfig(this.config)
        .hookPlugins(this.plugins)
        .setParent(parentCps)
        .setCpx(this)
        .setDefinition({
          id: idList[0],
          params: this.getParamsByAudience(0),
        });
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
            .hookConfig(this.config)
            .hookPlugins(this.plugins)
            .setCpx(this)
            .setParent(prev)
            .setDefinition({
              id: idList[i],
              params: this.getParamsByAudience(i),
            });
          // .setParams(this.getParams(i))
          // .setId(idList[i]);
          this.cps.push(curr);
        }
        return this;
    }
  }

  @rejectValues(undefined)
  getLeafCps(): ICps {
    return this.cps.at(-1)!;
  }

  @rejectValues(undefined)
  getRootCps(): ICps {
    return this.cps[0];
  }

  parse(input: CpxParseInput): IAstNode {
    return this.getRootCps().parse(input);
  }
}
