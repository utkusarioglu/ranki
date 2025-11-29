import type {
  ICps,
  IConfig,
  IPlugins,
  IDqmComponent,
  IParams,
  ICpx,
  CpxParseInput,
  CpsDefinition,
} from "@ranki/package-dqm-api-v2";
import { Id } from "../id/id.mjs";
import { Params } from "./param/params.mjs";
import { assertExists } from "../utils/assertions.mjs";

export class Cps implements ICps {
  private id = new Id();
  private parent!: ICps;
  private config!: IConfig;
  private plugins!: IPlugins;
  private component!: IDqmComponent;
  private params: IParams = new Params();
  private cpx!: ICpx;

  hookConfig(config: IConfig): ICps {
    this.config = config.clone();
    return this;
  }

  setParent(cps: ICps): ICps {
    this.parent = cps;
    return this;
  }

  setDefinition(def: CpsDefinition): ICps {
    this.id.setId(def.id);
    this.component = this.plugins.getComponent(def.id);
    this.params.setSchema(this.component.stages.ast);
    def.params.forEach((param) => {
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

  hookPlugins(plugins: IPlugins): ICps {
    assertExists(plugins, "cps.plugins");
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
