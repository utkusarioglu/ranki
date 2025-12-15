import type {
  ChannelParamSpecs,
  IParam,
  ParamChannel,
  Alias,
  Chain,
  CommonTransportsConstructorParams,
} from "@dqm/package-dqm-api-v2";
import { IdLib } from "../../id/id-lib.mjs";
import { Param } from "../../nodes/param/param.mjs";
import { rejectValues } from "@dqm/package-utils";
import { CommonTransports } from "../../nodes/common-transports.mjs";
import { POSITIONAL_PARAM } from "../../constants.mjs";

export class ParamsChannelLib extends CommonTransports {
  private schema!: ChannelParamSpecs;
  private lib = new IdLib<IParam>();
  private failed: IParam[] = [];
  private channel;
  private currentPosition = 0;

  constructor(
    transports: CommonTransportsConstructorParams,
    channel: ParamChannel,
  ) {
    super(transports);
    this.channel = channel;
  }

  setSchema(schema: ChannelParamSpecs) {
    this.schema = schema;
    this.processSchema();
    return this;
  }

  /**
   * @dev
   * #1 Creates all params with their default values
   * these later get updated by the param instances created by the parsed language
   */
  private processSchema() {
    this.schema.params.forEach((p) => {
      const param = new Param(this.getTransports()) // #1
        .setChannel(this.channel)
        .setProducer("component-default")
        .setSpecs(this.schema)
        .setDefaultValues(p.values);
      param.getId().setChain(p.id.chain);
      this.lib.add(p.id, param);
    });
  }

  /**
   * @dev
   * #1 Tries to update the param by positional first
   * #2 If not positional, alias is used to update the param
   * #3 If alias fails as well, then chain is directly used
   * #4 This is meant to be a fail-safe every param should be accessible by chain
   */
  addParam(user: IParam) {
    let p: IParam;
    try {
      const alias = user.getId().getAlias();
      if (alias) {
        if (alias.join(".") === POSITIONAL_PARAM.join(".")) {
          const position = this.currentPosition++;
          const chain = this.schema.positionals[position];
          p = this.lib.getObjectByChain(chain);
          p.getId().setPosition(position);
        } else {
          p = this.lib.getObjectByAlias(alias);
          p.getId().setAlias(alias);
        }
      } else {
        const chain = user.getId().getChain();
        p = this.lib.getObjectById(chain);
      }

      // TODO here you need to decide what to do if a param isn't defined. Do
      // you want to ignore it or yell?

      p.setProducer("instance-declaration")
        .setAudience(user.getAudience())
        .setChannel(user.getChannel())
        .setValues(user.getValues());
    } catch (e) {
      this.failed.push(user);
      // TODO this should be reflected in validation
      console.log("failed push", { user, e, p: p!, cause: e });
    }

    return this;
  }

  @rejectValues(undefined)
  findById(id: Alias | Chain): IParam | never {
    return this.lib.getObjectById(id);
  }

  getCompilation<T>(): T {
    const c: any = {};

    for (const [chainString, param] of this.lib.peekActiveChains()) {
      let curr = c;
      const chain: Chain = chainString.split(".");
      chain.forEach((part, i, all) => {
        if (i < all.length - 1) {
          if (!curr[part]) {
            curr[part] = {};
          }
          curr = curr[part];
        } else {
          const values = param.getValues().map((v) => v.value);
          curr[part] = values.length === 1 ? values[0] : values;
        }
        //   c[part] =
      });
    }

    return c;
  }
}
