import type {
  ICpx,
  CpxParseInput,
  IAstNode,
  UniqueValue,
  CommonTransportsConstructorParams,
  ChainList,
} from "@dqm/package-dqm-api-v2";
import { CommonTransports } from "../common-transports.mjs";
import { Unique } from "../../unique/unique.mjs";
import { rawParamsCapability } from "./capabilities/raw-params.cap.mjs";
import { verticesCapability } from "../vertices.capability.mjs";
import { collectionCapability } from "./capabilities/collection.cap.mjs";

/**
 * These are param values provided by the source. These haven't been merged
 * with the defaults of their respective components yet.
 */
export class Cpx extends CommonTransports implements ICpx {
  private collection = collectionCapability(this);
  private rawParams = rawParamsCapability(this);
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
}
