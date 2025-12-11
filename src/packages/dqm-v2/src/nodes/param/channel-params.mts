import type {
  ChannelParamSpecs,
  IParam,
  ParamChannel,
  Alias,
  Chain,
  CommonTransportsConstructorParams,
} from "@dqm/package-dqm-api-v2";
import { IdLib } from "../../id/id-lib.mjs";
import { Param } from "./param.mjs";
import { DqmError, rejectValues } from "@dqm/package-utils";
import { CommonTransports } from "../common-transports.mjs";

export class ChannelParams extends CommonTransports {
  private schema!: ChannelParamSpecs;
  private lib = new IdLib<IParam>();
  private failed: IParam[] = [];
  private channel;

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
      const position = user.getId().getPosition();

      // const chain = user.getId().getChain();

      // console.log({ alias, position, chain });
      if (alias && position) {
        throw new DqmError("UNEXPECTED_CONFIGURATION", {
          why: "Param has both alias and position defined. This shouldn't be possible",
          alias,
          pos: position,
        });
      } else if (position) {
        const chain = this.schema.positionals[position];
        p = this.lib.getObjectById(chain);
        p.getId().setPosition(position);
      } else if (alias) {
        p = this.lib.getObjectById(alias);
        // const chain = this.lib.getChainByAlias(alias);

        p.getId().setAlias(alias);
      } else {
        const chain = user.getId().getChain();
        p = this.lib.getObjectById(chain);
      }
      // else {
      //   throw new DqmError("UNRECOGNIZED_PARAM", {
      //     chain,
      //     alias,
      //     position,
      //   });
      // }

      p.setProducer("instance-declaration")
        .setAudience(user.getAudience())
        .setChannel(user.getChannel())
        .setValues(user.getValues());
    } catch (e) {
      this.failed.push(user);
      // TODO this should be reflected in validation
      console.log("failed push", { user, e, p: p! });
    }

    return this;
  }

  @rejectValues(undefined)
  findById(id: Alias | Chain): IParam | never {
    return this.lib.getObjectById(id);
  }
}
