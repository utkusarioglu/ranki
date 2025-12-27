import type {
  Chain,
  IAstParamNode,
  ICpsParam,
  ParamChannel,
  ParamDefaultValue,
  ParamProducer,
} from "@dqm/package-dqm-api-v2";
import { idCapability } from "../../../capabilities/id.cap.mjs";
import { astParamCapability } from "../../../ast/param/capabilities/raw-param.cap.mjs";
import { paramSpecsCapability } from "../../../ast/param/capabilities/specs.cap.mjs";
import { cpsParamValuesCapability } from "./capabilities/cps-param-values.cap.mjs";

export class CpsParam implements ICpsParam {
  private values = cpsParamValuesCapability(this);
  private id = idCapability(this);
  private astParam = astParamCapability(this);
  private specs = paramSpecsCapability(this);
  private channel: ParamChannel;
  private producer: ParamProducer = "component-default";

  constructor(
    chain: Chain,
    channel: ParamChannel,
    defaultValues: ParamDefaultValue[],
  ) {
    this.id.setId(chain);
    this.channel = channel;
    this.values.setDefaultValues(defaultValues);
  }

  getChannel(): ParamChannel {
    return this.channel;
  }

  getProducer(): ParamProducer {
    return this.producer;
  }

  // RAW PARAM
  setAstParam(p: IAstParamNode): ICpsParam {
    this.astParam.setAstParam(p);
    this.producer = "instance-declaration";
    return this;
  }
  getAstValues = this.astParam.getValues;
  getAstParam = this.astParam.getAstParam;
  getAudience = this.astParam.getAudience;
  getOperator = this.astParam.getOperator;

  // SPECS
  getSpecs = this.specs.getSpecs;
  setSpecs = this.specs.setSpecs;

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
  getMergedValues() {
    return this.values.getMergedValues(this.getAstValues());
  }
  getDefaultValues = this.values.getDefaultValues.bind(this.values);
  setDefaultValues = this.values.setDefaultValues.bind(this.values);
}
