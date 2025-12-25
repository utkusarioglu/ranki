import type {
  ICpx,
  CpxParseInput,
  // IAstParamNode,
  // IdList,
  // ICps,
  // Audience,
  IAstNode,
  // ChainList,
  // ChainStringList,
  // ChainListString,
  // IdStringList,
  // IdListString,
  // AliasList,
  UniqueValue,
  CommonTransportsConstructorParams,
  ChainList,
} from "@dqm/package-dqm-api-v2";
// import { dependsOn, rejectValues } from "@dqm/package-dqm-utils";
// import { ALL_AUDIENCES } from "../ast/param/param.constants.mjs";
// import { Cps } from "./cps.mjs";
import { CommonTransports } from "../common-transports.mjs";
// import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";
import { Unique } from "../../unique/unique.mjs";
import { rawParamsCapability } from "./capabilities/raw-params.cap.mjs";
import { verticesCapability } from "../vertices.capability.mjs";
import { collectionCapability } from "./capabilities/collection.cap.mjs";

/**
 * These are param values provided by the source. These haven't been merged
 * with the defaults of their respective components yet.
 */
export class Cpx extends CommonTransports implements ICpx {
  private uniqueValue: UniqueValue;
  // private parent: ICpx | null = null;
  // private prev: ICpx | null = null;
  // private next: ICpx | null = null;
  // private children: ICpx[] = [];
  // private rawParams: IAstParamNode[] | null = null; // #1
  // private cps: ICps[] = [];
  // private rootAst!: IAstNode;

  private collection = collectionCapability(this);
  private rawParams = rawParamsCapability(this);
  private vertices = verticesCapability(this);

  constructor(ct: CommonTransportsConstructorParams) {
    super(ct);
    this.uniqueValue = Unique.getNewUnique();
  }

  // VERTICES
  setParent = this.vertices.setParent.bind(this.vertices);
  getParent = this.vertices.getParent.bind(this.vertices);
  getNext = this.vertices.getNext.bind(this.vertices);
  getPrev = this.vertices.getPrev.bind(this.vertices);
  setPrev = this.vertices.setPrev.bind(this.vertices);
  setNext = this.vertices.setNext.bind(this.vertices);
  getChildren = this.vertices.getChildren.bind(this.vertices);
  pushChild = this.vertices.pushChild.bind(this.vertices);

  // setPrev(prev: ICpx): this {
  //   this.prev = prev;
  //   return this;
  // }

  // setNext(next: ICpx): this {
  //   this.next = next;
  //   return this;
  // }

  // getPrev(): ICpx | null {
  //   return this.prev;
  // }

  // getNext(): ICpx | null {
  //   return this.next;
  // }

  // setParent(parent: ICpx) {
  //   this.parent = parent;
  //   if (this.parent) {
  //     this.parent.pushChild(this);
  //   }
  //   return this;
  // }

  // getParent(): ICpx | null {
  //   return this.parent;
  // }

  // pushChild(cpx: ICpx): this {
  //   this.children.push(cpx);
  //   return this;
  // }

  // getChildren(): ICpx[] {
  //   return this.children;
  // }

  getUnique() {
    return this.uniqueValue;
  }

  parse(input: CpxParseInput): IAstNode {
    return this.getRootCps().parse(input);
  }

  // RAW PARAMS
  setRawParams = this.rawParams.setRawParams.bind(this.rawParams);
  getRawParams = this.rawParams.getRawParams.bind(this.rawParams);
  getRawParamsByAudience = this.rawParams.getRawParamsByAudience.bind(
    this.rawParams,
  );

  // COLLECTION
  setIdList(idList: ChainList): this {
    this.collection.setIdList(
      idList,
      this.getParent.bind(this),
      this.getTransports.bind(this),
      this.getRawParamsByAudience.bind(this),
    );
    return this;
  }

  getLeafCps = this.collection.getLeafCps.bind(this.collection);
  getRootCps = this.collection.getRootCps.bind(this.collection);
  getCpsList = this.collection.getCpsList.bind(this.collection);
  getChainList = this.collection.getChainList.bind(this.collection);
  getChainListString = this.collection.getChainListString.bind(this.collection);
  getIdListString = this.collection.getIdListString.bind(this.collection);
  getIdStringList = this.collection.getIdStringList.bind(this.collection);
  getChainStringList = this.collection.getChainStringList.bind(this.collection);
  getIdList = this.collection.getIdList.bind(this.collection);
  getAliasList = this.collection.getAliasList.bind(this.collection);
  getRootAst = this.collection.getRootAst.bind(this.collection);
  setRootAst = this.collection.setRootAst.bind(this.collection);

  // setRawParams(params: IAstParamNode[]) {
  //   // TODO this only sets the values from the component specification
  //   // the default config could also define some values for components
  //   // this.params.setSchema(this.component.stages.ast);
  //   // params.forEach((param) => {
  //   //   this.params.addParam(param);
  //   // });
  //   this.rawParams = params;
  //   return this;
  // }

  // @dependsOn("rawParams")
  // getRawParamsByAudience(audience: Audience): IAstParamNode[] {
  //   return this.rawParams!.filter((p) =>
  //     [ALL_AUDIENCES, audience].includes(p.getAudience()),
  //   );
  // }

  // getRawParams(): IAstParamNode[] | null {
  //   return this.rawParams;
  // }

  // @dependsOn("rawParams")
  // setIdList(idList: IdList): this {
  //   const createRoot = () => {
  //     const parentCpx = this.getParent();
  //     const parentCps = parentCpx ? parentCpx.getLeafCps() : null;
  //     const newCps = new Cps(this.getTransports());
  //     if (parentCps) {
  //       newCps.setParent(parentCps);
  //     }
  //     newCps.setCpx(this).setDefinition({
  //       id: idList[0],
  //       params: this.getRawParamsByAudience(0),
  //     });
  //     return newCps as ICps;
  //   };

  //   switch (idList.length) {
  //     case 0:
  //       throw new DqmAppError({
  //         code: "CHAIN_LIST_EMPTY",
  //         why: "Was given an Id of length 0",
  //         cause: null,
  //         details: { cpx: this },
  //       });
  //     case 1:
  //       this.cps.push(createRoot());
  //       return this;
  //     default:
  //       let curr = createRoot();
  //       this.cps.push(curr);
  //       for (let i = 1; i < idList.length; i++) {
  //         const prev = curr;
  //         curr = new Cps(this.getTransports())
  //           .setCpx(this)
  //           .setParent(prev)
  //           .setDefinition({
  //             id: idList[i],
  //             params: this.getRawParamsByAudience(i),
  //           });
  //         this.cps.push(curr);
  //       }
  //       return this;
  //   }
  // }

  // @rejectValues(undefined)
  // getLeafCps(): ICps {
  //   return this.cps.at(-1)!;
  // }

  // @rejectValues(undefined)
  // getRootCps(): ICps {
  //   return this.cps[0];
  // }

  // getCpsList(): ICps[] {
  //   return this.cps;
  // }

  // getChainList(): ChainList {
  //   return this.cps.map((cps) => cps.getChain());
  // }

  // getChainStringList(): ChainStringList {
  //   return this.cps.map((cps) => cps.getChainString());
  // }

  // getIdStringList(): IdStringList {
  //   return this.cps.map((cps) => cps.getIdString());
  // }

  // getIdListString(): IdListString {
  //   return this.cps.map((cps) => cps.getIdString()).join(ID_STRING_SEPARATOR);
  // }

  // getChainListString(): ChainListString {
  //   return this.cps
  //     .map((cps) => cps.getChainString())
  //     .join(CHAIN_STRING_SEPARATOR);
  // }

  // getIdList(): IdList {
  //   return this.cps.map((cps) => cps.getId());
  // }

  // getAliasList(): AliasList {
  //   return this.cps.map((c) => c.getAlias());
  // }

  // setRootAst(ast: IAstNode): this {
  //   this.rootAst = ast;
  //   return this;
  // }

  // @dependsOn("rootAst")
  // getRootAst(): IAstNode {
  //   return this.rootAst;
  // }
}
