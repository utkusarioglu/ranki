import type {
  // AstSourceView,
  IAstParamNode,
  ICpsParam,
  ParamChannel,
  ParamDefaultValue,
  ParamProducer,
} from "@dqm/package-dqm-api-v2";
// import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";
import { idCapability } from "../capabilities/id.cap.mjs";
import { astParamCapability } from "../ast/param/capabilities/raw-param.cap.mjs";
import { paramSpecsCapability } from "../ast/param/capabilities/specs.cap.mjs";

export class CpsParam implements ICpsParam {
  private values = cpsParamValuesCapability(this);
  private id = idCapability(this);
  private astParam = astParamCapability(this);
  private specs = paramSpecsCapability(this);
  private channel: ParamChannel;
  private producer: ParamProducer = "component-default";

  constructor(channel: ParamChannel) {
    this.channel = channel;
  }

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
  // setValues = this.values.setValues.bind(this.values);
  getDefaultValues = this.values.getDefaultValues.bind(this.values);
  setDefaultValues = this.values.setDefaultValues.bind(this.values);

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

  getValues() {
    return this.getAstValues();
  }

  getChannel(): ParamChannel {
    return this.channel;
  }

  getProducer(): ParamProducer {
    return this.producer;
  }

  // get audience
  // get channel
  // get producer
  // get operator

  // get key
  // get object form (like a nested object)
  // get ast param
}

export function cpsParamValuesCapability<T>(self: T) {
  // let values: AstSourceView[] = [];
  let defaultValues: ParamDefaultValue[] = [];

  return {
    setDefaultValues(valueSpec: ParamDefaultValue[]): T {
      defaultValues = valueSpec;
      return self;
    },

    getDefaultValues(): ParamDefaultValue[] {
      return defaultValues;
    },

    // setValues(v: AstSourceView[]): T {
    //   values = v;
    //   return self;
    // },

    // getValues(): AstSourceView[] {
    //   return values;
    // },

    // checkValues() {
    //   if (values.length > defaultValues.length) {
    //     throw new DqmAppError({
    //       code: "TOO_MANY_VALUES",
    //       why: "Params are tuples and cannot define larger arrays than their default values",
    //       cause: null,
    //       details: {
    //         values: values,
    //         defaults: defaultValues,
    //       },
    //     });
    //   }
    // },
  };
}
