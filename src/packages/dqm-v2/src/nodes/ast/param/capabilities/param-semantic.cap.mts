import type {
  Audience,
  Operator,
  ParamChannel,
  ParamProducer,
} from "@dqm/package-dqm-api-v2";
import { assertExists } from "@dqm/package-dqm-utils";
import { ALL_AUDIENCES } from "../param.constants.mjs";

export function paramSemanticCapability<T>(self: T) {
  let audience: Audience = ALL_AUDIENCES;
  let operator: Operator;
  // let producer: ParamProducer = "instance-declaration";
  let channel!: ParamChannel;

  return {
    setAudience(a: Audience): T {
      audience = a;
      return self;
    },

    getAudience(): Audience {
      return audience;
    },

    /**
     * = += -= =+ =- etc
     */
    setOperator(o: Operator): T {
      operator = o;
      return self;
    },

    getOperator(): Operator {
      assertExists(operator, {
        why: "Asking for an operator while it hasn't been defined strongly suggests that there is an architectural issue.",
      });
      return operator;
    },

    // setProducer(p: ParamProducer): T {
    //   producer = p;
    //   return self;
    // },

    // getProducer(): ParamProducer {
    //   return producer;
    // },

    setChannel(c: ParamChannel): T {
      channel = c;
      return self;
    },

    getChannel(): ParamChannel {
      return channel;
    },
  };
}
