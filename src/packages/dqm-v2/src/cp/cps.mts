import type {
  ICps,
  IConfig,
  IPlugins,
  IDqmComponent,
  IParams,
  ICpx,
  Chain,
  Alias,
  IParam,
  CpxParseInput,
} from "@ranki/package-dqm-api-v2";
import { dependsOn } from "../decorators.mjs";
import { Id } from "../id/id.mjs";
import { Params } from "./param/params.mjs";

export class Cps implements ICps {
  private id = new Id();
  private parent!: ICps;
  private config!: IConfig;
  private plugins!: IPlugins;
  private component!: IDqmComponent;
  private params: IParams = new Params();
  private cpx!: ICpx;

  setId(id: Chain | Alias): ICps {
    this.id.setId(id);
    this.component = this.plugins.getComponent(id);
    return this;
  }

  hookConfig(config: IConfig): ICps {
    this.config = config.clone();
    return this;
  }

  setParent(cps: ICps): ICps {
    this.parent = cps;
    return this;
  }

  @dependsOn("component")
  setParams(params: IParam[]) {
    // TODO this only sets the values from the component specification
    // the default config could also define some values for components
    this.params.setSchema(this.component.stages.ast);
    params.forEach((param) => {
      this.params.addParam(param);
    });
    return this;
  }

  setCpx(cpx: ICpx): ICps {
    this.cpx = cpx;
    return this;
  }

  getCpx(): ICpx {
    return this.cpx;
  }

  setPlugins(plugins: IPlugins): ICps {
    this.plugins = plugins;
    return this;
  }

  getParent(): ICps {
    return this.parent;
  }

  getConfig(): IConfig {
    return this.config;
  }

  parse(input: CpxParseInput): ICps {
    console.log(input);
    return this;
  }
}
