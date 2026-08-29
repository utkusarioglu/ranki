import type {
  Chain,
  ICpsParam,
  MutationEntry,
  ParamChannel,
} from "@dqm/package-dqm-api-v2";
import { idCapability } from "../../../capabilities/id.cap.mjs";
import { astParamCapability } from "../../../ast/param/capabilities/raw-param.cap.mjs";
import { TypeEngine } from "@dqm/package-dqm-config";
import { assertNever } from "../../../../errors/dqm-app-error/assertions.mjs";
import { assertExists } from "@dqm/package-dqm-utils";

export class CpsParam implements ICpsParam {
  private id = idCapability(this);
  private astParam = astParamCapability(this);
  private channel: ParamChannel;

  constructor(chain: Chain, channel: ParamChannel) {
    this.id.setId(chain);
    this.channel = channel;
  }

  getChannel(): ParamChannel {
    return this.channel;
  }

  getMutationEntries(includeChannel: boolean): MutationEntry[] {
    if (!this.isCoupled()) {
      return [];
    }
    const chain = this.getChain();
    const chainString = this.getChainString();
    const astValues = this.getAstValues();
    const tuple = astValues.map((v) => v.value);
    const tupleType = TypeEngine.determineType(tuple);
    const channel = this.getChannel();
    const eraser: any = includeChannel ? { [channel]: {} } : {};
    const mutation: any = includeChannel ? { [channel]: {} } : {};
    let currE = includeChannel ? eraser[channel] : eraser;
    let currM = includeChannel ? mutation[channel] : mutation;
    let includeEraser = false;
    const chainLast = chain.at(-1);
    assertExists(chainLast, {
      why: "Chains are expected to be multi element string arrays",
    });
    chain.slice(0, -1).forEach((part) => {
      currE[part] = {};
      currM[part] = {};
      currE = currE[part];
      currM = currM[part];
    });
    currM[chainLast] = tuple;
    const operator = this.getOperator();
    switch (tupleType) {
      case "array-scalar":
      case "tuple":
        break;
      case "array-populated":
        switch (operator) {
          case "assign":
            includeEraser = true;
            currE[chainLast] = [];
            break;
          case "append":
          case "prepend":
            // case "shift":
            break;
          default:
            assertNever({
              why: "Params are not expected carry this operator",
              details: {
                tuple,
                tupleType,
                chain,
                operator,
              },
            });
        }
        break;
      default:
        assertNever({
          why: "Params are not expected to store this type",
          details: {
            tuple,
            tupleType,
            chain,
            operator,
          },
        });
    }

    if (includeEraser) {
      return [
        {
          type: "eraser",
          chainString,
          value: eraser,
        },
        {
          type: "mutator",
          chainString,
          value: mutation,
        },
      ];
    } else {
      return [
        {
          type: "mutator",
          chainString,
          value: mutation,
        },
      ];
    }
  }

  // RAW PARAM
  setAstParam = this.astParam.setAstParam;
  getAstValues = this.astParam.getValues;
  getAstParam = this.astParam.getAstParam;
  getAudience = this.astParam.getAudience;
  getOperator = this.astParam.getOperator;
  isCoupled = this.astParam.isCoupled;

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
}
