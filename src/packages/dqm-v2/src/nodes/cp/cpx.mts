import type {
  ICpx,
  // IPlugins,
  // IConfig,
  CpxParseInput,
  IParam,
  IdList,
  ICps,
  Audience,
  IAstNode,
} from "@dqm/package-dqm-api-v2";
import { DqmError, dependsOn, rejectValues } from "@dqm/package-utils";
import { ALL_AUDIENCES } from "../param/param.constants.mjs";
import { Cps } from "./cps.mjs";
import { CommonTransports } from "../common-transports.mjs";

export class Cpx extends CommonTransports implements ICpx {
  private parent!: ICpx;
  // private config!: IConfig;
  // private plugins!: IPlugins;
  private params!: IParam[];
  private cps: ICps[] = [];
  private rootAst!: IAstNode;

  // constructor(plugins: IPlugins, config: IConfig) {
  //   this.plugins = plugins;
  //   this.config = config.clone();
  // }

  // @rejectValues(undefined)
  // private getConfig(): IConfig {
  //   return this.config;
  // }

  // @rejectValues(undefined)
  // private getPlugins(): IPlugins {
  //   return this.plugins;
  // }

  setRootAst(ast: IAstNode): ICpx {
    this.rootAst = ast;
    return this;
  }

  @dependsOn("rootAst")
  getRootAst(): IAstNode {
    return this.rootAst;
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
      const newCps = new Cps(this.getTransports());
      if (parentCps) {
        newCps.setParent(parentCps);
      }
      newCps.setCpx(this).setDefinition({
        id: idList[0],
        params: this.getParamsByAudience(0),
      });
      return newCps as ICps;
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
          curr = new Cps(this.getTransports())
            .setCpx(this)
            .setParent(prev)
            .setDefinition({
              id: idList[i],
              params: this.getParamsByAudience(i),
            });
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
