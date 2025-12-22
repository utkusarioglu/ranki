import type {
  ICpx,
  CpxParseInput,
  IParam,
  IdList,
  ICps,
  Audience,
  IAstNode,
  ChainList,
  IId,
} from "@dqm/package-dqm-api-v2";
import { dependsOn, rejectValues } from "@dqm/package-dqm-utils";
import { ALL_AUDIENCES } from "../param/param.constants.mjs";
import { Cps } from "./cps.mjs";
import { CommonTransports } from "../common-transports.mjs";
import { Id } from "../../id/id.mjs";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";

/**
 * These are param values provided by the source. These haven't been merged
 * with the defaults of their respective components yet.
 */
export class Cpx extends CommonTransports implements ICpx {
  private id = new Id();
  private parent: ICpx | null = null;
  private prev: ICpx | null = null;
  private next: ICpx | null = null;
  private children: ICpx[] = [];
  private rawParams: IParam[] | null = null; // #1
  private cps: ICps[] = [];
  private rootAst!: IAstNode;

  setPrev(prev: ICpx): this {
    this.prev = prev;
    return this;
  }

  setNext(next: ICpx): this {
    this.next = next;
    return this;
  }

  getPrev(): ICpx | null {
    return this.prev;
  }

  getNext(): ICpx | null {
    return this.next;
  }

  getId(): IId {
    return this.id;
  }

  getChainList(): ChainList {
    return this.cps.map((cps) => cps.getId().getChain());
  }

  getIdList(): IdList {
    return this.cps.map((cps) => cps.getId().getId());
  }

  setRootAst(ast: IAstNode): this {
    this.rootAst = ast;
    return this;
  }

  @dependsOn("rootAst")
  getRootAst(): IAstNode {
    return this.rootAst;
  }

  setRawParams(params: IParam[]) {
    // TODO this only sets the values from the component specification
    // the default config could also define some values for components
    // this.params.setSchema(this.component.stages.ast);
    // params.forEach((param) => {
    //   this.params.addParam(param);
    // });
    this.rawParams = params;
    return this;
  }

  @dependsOn("rawParams")
  getRawParamsByAudience(audience: Audience): IParam[] {
    return this.rawParams!.filter((p) =>
      [ALL_AUDIENCES, audience].includes(p.getAudience()),
    );
  }

  getRawParams(): IParam[] | null {
    return this.rawParams;
  }

  setParent(parent: ICpx) {
    this.parent = parent;
    if (this.parent) {
      this.parent.pushChild(this);
    }
    return this;
  }

  getParent(): ICpx | null {
    return this.parent;
  }

  pushChild(cpx: ICpx): this {
    this.children.push(cpx);
    return this;
  }

  getChildren(): ICpx[] {
    return this.children;
  }

  @dependsOn("rawParams")
  setIdList(idList: IdList): this {
    const createRoot = () => {
      const parentCpx = this.getParent();
      const parentCps = parentCpx ? parentCpx.getLeafCps() : null;
      const newCps = new Cps(this.getTransports());
      if (parentCps) {
        newCps.setParent(parentCps);
      }
      newCps.setCpx(this).setDefinition({
        id: idList[0],
        params: this.getRawParamsByAudience(0),
      });
      return newCps as ICps;
    };

    switch (idList.length) {
      case 0:
        throw new DqmAppError({
          code: "CHAIN_LIST_EMPTY",
          why: "Was given an Id of length 0",
          cause: null,
          details: { cpx: this },
        });
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
              params: this.getRawParamsByAudience(i),
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

  getCpsList(): ICps[] {
    return this.cps;
  }

  parse(input: CpxParseInput): IAstNode {
    return this.getRootCps().parse(input);
  }
}
