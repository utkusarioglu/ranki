import type {
  ICpx,
  CpxParseInput,
  IAstNode,
  UniqueValue,
  CommonTransportsConstructorParams,
  ChainList,
} from "@dqm/package-dqm-api-v2";
import { CommonTransports } from "../../common-transports.mjs";
import { Unique } from "../../../unique/unique.mjs";
import { astParamsCapability } from "../capabilities/ast-params.cap.mjs";
import { verticesCapability } from "../../capabilities/vertices.capability.mjs";
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
  private vertices = verticesCapability<this, ICpx>(this);
  private uniqueValue: UniqueValue;

  constructor(ct: CommonTransportsConstructorParams) {
    super(ct);
    this.uniqueValue = Unique.getNewUnique();
  }

  getUnique() {
    return this.uniqueValue;
  }

  parse(input: CpxParseInput): IAstNode {
    return this.getRootCps().parse(input);
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
      this.getParent.bind(this),
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

  // AST
  getRootAst = this.ast.getRootAst.bind(this.cps);
  setRootAst = this.ast.setRootAst.bind(this.cps);
}
