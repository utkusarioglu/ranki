import type {
  ICpx,
  CpxParseInput,
  IAstNode,
  ChainList,
} from "@dqm/package-dqm-api-v2";
import { CommonTransports } from "../../common-transports.mjs";
import { astParamsCapability } from "../capabilities/ast-params.cap.mjs";
import { edgeCapability } from "../../capabilities/edge.capability.mjs";
import { cpsCollectionCapability } from "../capabilities/cps-collection.cap.mjs";
import { astCollectionCapability } from "../capabilities/ast-collection.cap.mjs";

/**
 * These are param values provided by the source. These haven't been merged
 * with the defaults of their respective components yet.
 */
export class Cpx extends CommonTransports implements ICpx {
  private cps = cpsCollectionCapability(this);
  private ast = astCollectionCapability(this);
  private astParams = astParamsCapability(this);
  private cpxE = edgeCapability<ICpx>(this, "Cpx");

  parse(input: CpxParseInput): IAstNode {
    return this.getTargetCps().parse(input);
  }

  // VERTICES
  setCpxParent = this.cpxE.setParent.bind(this.cpxE);
  getCpxParent = this.cpxE.getParent.bind(this.cpxE);
  getCpxNext = this.cpxE.getNext.bind(this.cpxE);
  getCpxPrev = this.cpxE.getPrev.bind(this.cpxE);
  setCpxPrev = this.cpxE.setPrev.bind(this.cpxE);
  setCpxNext = this.cpxE.setNext.bind(this.cpxE);
  getCpxEdges = this.cpxE.getEdges.bind(this.cpxE);
  pushCpxEdge = this.cpxE.pushEdge.bind(this.cpxE);

  // RAW PARAMS
  setAstParams = this.astParams.setAstParams.bind(this.astParams);
  getAstParams = this.astParams.getAstParams.bind(this.astParams);
  getAstParamsByAudience = this.astParams.getAstParamsByAudience.bind(
    this.astParams,
  );

  // COLLECTION
  setIdList(idList: ChainList): this {
    this.cps.setIdList(
      idList,
      this.getCpxParent.bind(this),
      this.getTransports.bind(this),
      this.getAstParamsByAudience.bind(this),
    );
    return this;
  }

  getLeafCps = this.cps.getLeafCps.bind(this.cps);
  getRootCps = this.cps.getRootCps.bind(this.cps);
  getCpsList = this.cps.getCpsList.bind(this.cps);
  getChainList = this.cps.getChainList.bind(this.cps);
  getChainListString = this.cps.getChainListString.bind(this.cps);
  getIdListString = this.cps.getIdListString.bind(this.cps);
  getIdStringList = this.cps.getIdStringList.bind(this.cps);
  getChainStringList = this.cps.getChainStringList.bind(this.cps);
  getIdList = this.cps.getIdList.bind(this.cps);
  getAliasList = this.cps.getAliasList.bind(this.cps);
  setTargetCps = this.cps.setTargetCps.bind(this.cps);
  getTargetCps = this.cps.getTargetCps.bind(this.cps);

  // AST
  getRootAst = this.ast.getRootAst.bind(this.cps);
  setRootAst = this.ast.setRootAst.bind(this.cps);
}
