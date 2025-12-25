import type { IAstParamNode } from "@dqm/package-dqm-api-v2";
import { AstNode } from "../base/ast-node.mjs";
import { rawParamCapability } from "./capabilities/raw-param.cap.mjs";
import { paramSemanticCapability } from "./capabilities/param-semantic.cap.mjs";
import { paramValueCapability } from "./capabilities/param-value.cap.mjs";
import { idCapability } from "../../capabilities/id.cap.mjs";
import { paramSpecsCapability } from "./capabilities/specs.cap.mjs";

export class AstParamNode extends AstNode implements IAstParamNode {
  private rawParam = rawParamCapability(this);
  private paramSemantic = paramSemanticCapability(this);
  private value = paramValueCapability(this);
  private id = idCapability(this);
  private specs = paramSpecsCapability(this);

  // RAW PARAM
  setRawParam = this.rawParam.setRawParam.bind(this.rawParam);
  getRawParam = this.rawParam.getRawParam.bind(this.rawParam);

  // SPECS
  getSpecs = this.specs.getSpecs;
  setSpecs = this.specs.setSpecs;

  // PARAM SEMANTIC
  setAudience = this.paramSemantic.setAudience.bind(this.paramSemantic);
  getAudience = this.paramSemantic.getAudience.bind(this.paramSemantic);
  setOperator = this.paramSemantic.setOperator.bind(this.paramSemantic);
  getOperator = this.paramSemantic.getOperator.bind(this.paramSemantic);
  setProducer = this.paramSemantic.setProducer.bind(this.paramSemantic);
  getProducer = this.paramSemantic.getProducer.bind(this.paramSemantic);
  setChannel = this.paramSemantic.setChannel.bind(this.paramSemantic);
  getChannel = this.paramSemantic.getChannel.bind(this.paramSemantic);

  // ID
  setAlias = this.id.setAlias;
  getAlias = this.id.getAlias;
  getAliasString = this.id.getAliasString;
  setPosition = this.id.setPosition;
  getId = this.id.getId;
  setId = this.id.setId;
  getIdString = this.id.getIdString;
  getChain = this.id.getChain;
  getChainString = this.id.getChainString;

  // VALUE
  setDefaultValues = this.value.setDefaultValues.bind(this.value);
  getDefaultValues = this.value.getDefaultValues.bind(this.value);
  setValues = this.value.setValues.bind(this.value);
  getValues = this.value.getValues.bind(this.value);
  checkValues = this.value.checkValues.bind(this.value);
}
