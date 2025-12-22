import type {
  ChannelParamSpecs,
  IParam,
  ParamChannel,
  Alias,
  Chain,
  CommonTransportsConstructorParams,
  DqmConfig,
} from "@dqm/package-dqm-api-v2";
import { IdLib } from "../../id/id-lib.mjs";
import { Param } from "../../nodes/param/param.mjs";
import { rejectValues } from "@dqm/package-dqm-utils";
import { CommonTransports } from "../../nodes/common-transports.mjs";
import { INITIAL_CONFIG_NAME, POSITIONAL_PARAM } from "../../constants.mjs";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";
import { assertExists } from "@dqm/package-dqm-utils";

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

  getParams() {
    return this.lib.getAllValues();
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
   * #2 Sets only the chain because a param may have multiple aliases. If the
   * source uses an alias, the corresponding chain is determines from the
   * schema and the param is determined through the chain.
   */
  private processSchema() {
    this.schema.params.forEach((p) => {
      const param = new Param(this.getTransports()) // #1
        .setChannel(this.channel)
        .setProducer("component-default")
        .setSpecs(this.schema)
        .setDefaultValues(p.values);
      param.getId().setId(p.id.chain); // #2
      this.lib.add(p.id, param);
    });
  }

  private determineParam(user: IParam): IParam | undefined {
    try {
      let p: IParam;
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
      assertExists(p, {
        why: "All methods for determining the booked param have been depleted.",
      });
      return p;
    } catch (e) {
      const initial =
        this.getConfig().getConfig<DqmConfig>(INITIAL_CONFIG_NAME);
      switch (initial.plugins.onOrphanParam) {
        case "ignore":
          this.failed.push(user);
          break;
        default:
          throw new DqmAppError({
            code: "ORPHAN_PARAM",
            why: "Param doesn't exist in schema and the initial configuration is set to fail on orphan params",
            cause: e,
            details: {
              userSuppliedParamId: user.getId().getId(),
              schema: this.schema,
            },
          });
      }
    }
  }

  /**
   * @dev
   * #1 Tries to update the param by positional first
   * #2 If not positional, alias is used to update the param
   * #3 If alias fails as well, then chain is directly used
   * #4 This is meant to be a fail-safe every param should be accessible by chain
   */
  addParam(user: IParam) {
    let p = this.determineParam(user);
    if (!p) {
      return;
    }
    try {
      // const alias = user.getId().getAlias();
      // if (alias) {
      //   if (alias.join(".") === POSITIONAL_PARAM.join(".")) {
      //     const position = this.currentPosition++;
      //     const chain = this.schema.positionals[position];
      //     p = this.lib.getObjectByChain(chain);
      //     p.getId().setPosition(position);
      //   } else {
      //     p = this.lib.getObjectByAlias(alias);
      //     p.getId().setAlias(alias);
      //   }
      // } else {
      //   const chain = user.getId().getChain();
      //   p = this.lib.getObjectById(chain);
      // }

      // TODO here you need to decide what to do if a param isn't defined. Do
      // you want to ignore it or yell?

      p.setRawParam(user)
        .setProducer("instance-declaration")
        .setAudience(user.getAudience())
        .setChannel(user.getChannel())
        .setOperator(user.getOperator())
        .setValues(user.getValues());
    } catch (e) {
      // const initial =
      //   this.getConfig().getConfig<DqmConfig>(INITIAL_CONFIG_NAME);
      // switch (initial.plugins.onOrphanParam) {
      //   case "ignore":
      //     this.failed.push(user);
      //     break;
      //   default:
      //     throw new DqmAppError({
      //       code: "ORPHAN_PARAM",
      //       why: "Param doesn't exist in schema and the initial configuration is set to fail on orphan params",
      //       cause: e,
      //       details: {
      //         userSuppliedParamId: user.getId().getId(),
      //         schema: this.schema,
      //       },
      //     });
      // }
      // // TODO this should be reflected in validation
      // console.log("failed push", { user, e, p: p!, cause: e });
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
