import type { AstSourceView, ParamDefaultValue } from "@dqm/package-dqm-api-v2";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";
import { idCapability } from "../capabilities/id.cap.mjs";
import { rawParamCapability } from "../ast/param/capabilities/raw-param.cap.mjs";
import { paramSemanticCapability } from "../ast/param/capabilities/param-semantic.cap.mjs";

export class CpsParam {
  private values = cpsParamValuesCapability(this);
  private id = idCapability(this);
  private rawParam = rawParamCapability(this);
  private semantic = paramSemanticCapability(this);

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
  getValues = this.values.getValues.bind(this.values);
  setValues = this.values.setValues.bind(this.values);
  getDefaultValues = this.values.getDefaultValues.bind(this.values);
  setDefaultValues = this.values.setDefaultValues.bind(this.values);

  // RAW PARAM
  setRawParam = this.rawParam.setRawParam.bind(this.rawParam);
  getRawParam = this.rawParam.getRawParam.bind(this.rawParam);

  // PARAM SEMANTIC
  setAudience = this.semantic.setAudience.bind(this.semantic);
  getAudience = this.semantic.getAudience.bind(this.semantic);
  setOperator = this.semantic.setOperator.bind(this.semantic);
  getOperator = this.semantic.getOperator.bind(this.semantic);
  setProducer = this.semantic.setProducer.bind(this.semantic);
  getProducer = this.semantic.getProducer.bind(this.semantic);
  setChannel = this.semantic.setChannel.bind(this.semantic);
  getChannel = this.semantic.getChannel.bind(this.semantic);

  // get audience
  // get channel
  // get producer
  // get operator

  // get key
  // get object form (like a nested object)
  // get ast param
}

export function cpsParamValuesCapability<T>(self: T) {
  let values: AstSourceView[] = [];
  let defaultValues: ParamDefaultValue[] = [];

  return {
    setDefaultValues(valueSpec: ParamDefaultValue[]): T {
      defaultValues = valueSpec;
      return self;
    },

    getDefaultValues(): ParamDefaultValue[] {
      return defaultValues;
    },

    setValues(v: AstSourceView[]): T {
      values = v;
      return self;
    },

    getValues(): AstSourceView[] {
      return values;
    },

    checkValues() {
      if (values.length > defaultValues.length) {
        throw new DqmAppError({
          code: "TOO_MANY_VALUES",
          why: "Params are tuples and cannot define larger arrays than their default values",
          cause: null,
          details: {
            values: values,
            defaults: defaultValues,
          },
        });
      }
    },
  };
}
