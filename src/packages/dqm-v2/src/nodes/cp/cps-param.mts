import type {
  AstSourceView,
  Chain,
  // AstSourceView,
  IAstParamNode,
  ICpsParam,
  ICpsParamValue,
  ParamChannel,
  ParamDefaultValue,
  ParamProducer,
} from "@dqm/package-dqm-api-v2";
// import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";
import { idCapability } from "../capabilities/id.cap.mjs";
import { astParamCapability } from "../ast/param/capabilities/raw-param.cap.mjs";
import { paramSpecsCapability } from "../ast/param/capabilities/specs.cap.mjs";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";

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
  getDefaultValues = this.values.getDefaultValues.bind(this.values);
  setDefaultValues = this.values.setDefaultValues.bind(this.values);
  getValues = this.values.getMergedValues.bind(this.values);

  // RAW PARAM
  setAstParam(p: IAstParamNode): ICpsParam {
    this.astParam.setAstParam(p);
    this.producer = "instance-declaration";
    this.values.mergeValues(this.getAstValues());
    return this;
  }
  getAstValues = this.astParam.getValues;
  getAstParam = this.astParam.getAstParam;
  getAudience = this.astParam.getAudience;
  getOperator = this.astParam.getOperator;

  getChannel(): ParamChannel {
    return this.channel;
  }

  getProducer(): ParamProducer {
    return this.producer;
  }
}

export function cpsParamValuesCapability<T>(self: T) {
  // let values: AstSourceView[] = [];
  let defaultValues: ParamDefaultValue[] = [];
  let mergedValues: ICpsParamValue = [];

  return {
    setDefaultValues(valueSpec: ParamDefaultValue[]): T {
      defaultValues = valueSpec;
      return self;
    },

    getDefaultValues(): ParamDefaultValue[] {
      return defaultValues;
    },

    getMergedValues(): ICpsParamValue {
      return mergedValues;
    },

    /**
     * @dev
     * #1 Ast type determination is done by the grammar. Default value type is
     * reported by the plugin itself.
     */
    mergeValues(astValues: AstSourceView[]) {
      this.checkValueLength(astValues);
      defaultValues.forEach((dv, i) => {
        const av = astValues[i];
        if (!av) {
          mergedValues.push({
            type: dv.type,
            name: dv.name,
            defaultValue: dv.defaultValue,
            value: dv.defaultValue,
          });
          return;
        }
        // #1
        if (av.type !== dv.type) {
          throw new DqmAppError({
            code: "INCONSISTENT_TYPE",
            why: "Reported types of the default and the user values do not match",
            cause: null,
            details: {
              astValues,
              defaultValues,
              currentDefaultValue: dv,
              currentAstValue: av,
            },
          });
        }
        mergedValues.push({
          type: dv.type,
          subtype: av.subType,
          name: dv.name,
          defaultValue: dv.defaultValue,
          value: av.value,
        });
      });
    },

    checkValueLength(astValues: AstSourceView[]) {
      if (astValues.length > defaultValues.length) {
        throw new DqmAppError({
          code: "TOO_MANY_VALUES",
          why: "Params are tuples and cannot define larger arrays than their default values",
          cause: null,
          details: {
            values: astValues,
            defaults: defaultValues,
          },
        });
      }
    },
  };
}
