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
      this.lib.add(param.getId().getSummary(), param);
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
    let posChain: Chain | Alias | undefined;
    let def: IParam | undefined = undefined;

    // #1
    const pos = user.getId().getPosition();
    if (pos) {
      posChain = this.schema.positionals[pos];
      if (!posChain) {
        throw new DqmError("FAULTY_POSITION", {
          schema: this.schema,
          pos,
          obj: this,
        });
      }
      def = this.lib.getObjectById(posChain.join("."));
      def.getId().setPosition(pos);
    }

    // #2
    const alias = user.getId().getAlias();
    if (alias) {
      def = this.lib.getObjectById(alias.join("."));
      def.getId().setId(alias);
    }

    // #3
    const chain = user.getId().getChain();
    if (!def) {
      def = this.lib.getObjectById(chain.join("."));
    }

    // #4
    if (!def) {
      throw new DqmError("FAILED_PARAM_ADDRESSING", {
        pos,
        chain,
        alias,
        obj: this,
        param: user,
      });
    }

    def
      .setAudience(user.getAudience())
      .setOperator(user.getOperator())
      .setProducer("instance-declaration")
      .setValues(user.getValues());

    return this;
  }

  @rejectValues(undefined)
  findById(id: Alias | Chain): IParam | never {
    return this.lib.getObjectById(id.join("."));
  }
}
