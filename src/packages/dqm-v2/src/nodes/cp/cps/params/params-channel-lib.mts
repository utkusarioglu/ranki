import type {
  ChannelParamSpecs,
  IAstParamNode,
  ParamChannel,
  Alias,
  Chain,
  CommonTransportsConstructorParams,
  DqmConfig,
  ICpsParam,
} from "@dqm/package-dqm-api-v2";
import { IdLib } from "../../../../id/id-lib.mjs";
import { rejectValues } from "@dqm/package-dqm-utils";
import { CommonTransports } from "../../../../nodes/common-transports.mjs";
import {
  INITIAL_CONFIG_NAME,
  POSITIONAL_PARAM,
} from "../../../../constants.mjs";
import { DqmAppError } from "../../../../errors/dqm-app-error/dqm-app-error.mjs";
import { assertExists } from "@dqm/package-dqm-utils";
import { CpsParam } from "./cps-param.mjs";

export class ParamsChannelLib extends CommonTransports {
  private schema!: ChannelParamSpecs;
  private lib = new IdLib<ICpsParam>();
  private failed: IAstParamNode[] = [];
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
      // const param = new CpsParam(p.id.chain, this.channel, p.values); // #1
      const param = new CpsParam(p.id.chain, this.channel); // #1
      this.lib.add(p.id, param);
    });
  }

  /**
   * @dev
   * #1 Tries to update the param by positional first
   * #2 If not positional, alias is used to update the param
   * #3 If alias fails as well, then chain is directly used
   * #4 This is meant to be a fail-safe. Every param should be accessible by chain
   */
  private determineParam(ast: IAstParamNode): ICpsParam | undefined {
    try {
      let p: ICpsParam;
      const alias = ast.getAlias();
      if (alias) {
        // #1
        if (alias.join(".") === POSITIONAL_PARAM.join(".")) {
          const position = this.currentPosition++;
          const chain = this.schema.positionals[position];
          p = this.lib.getObjectByChain(chain);
          p.setPosition(position);
        } else {
          // #2
          p = this.lib.getObjectByAlias(alias);
          p.setAlias(alias);
        }
      } else {
        // #3
        const chain = ast.getChain();
        p = this.lib.getObjectById(chain);
      }
      assertExists(p, {
        why: "All methods for determining the booked param have been depleted.",
        details: { alias },
      });
      return p;
    } catch (e) {
      const initial =
        this.getConfig().getConfig<DqmConfig>(INITIAL_CONFIG_NAME);
      switch (initial.plugins.onOrphanParam) {
        case "ignore":
          this.failed.push(ast);
          break;
        default:
          throw new DqmAppError({
            code: "ORPHAN_PARAM",
            why: "Param doesn't exist in schema and the initial configuration is set to fail on orphan params",
            cause: e,
            details: {
              userSuppliedParamId: ast.getId(),
              schema: this.schema,
            },
          });
      }
    }
  }

  /**
   * @dev
   * #1 In case orphan params are set to be ignored, `p` may return undefined.
   */
  addParam(user: IAstParamNode) {
    const p = this.determineParam(user);
    if (!p) {
      return; // #1
    }
    try {
      p.setAstParam(user);
    } catch (e) {
      // TODO get rid of this
      console.log("value transfer failed", e);
    }

    return this;
  }

  @rejectValues(undefined)
  findById(id: Alias | Chain): ICpsParam | never {
    return this.lib.getObjectById(id);
  }

  getCompilation<T>(): T {
    const c: any = {};

    for (const [chainString, param] of this.lib.peekActiveChains()) {
      if (!param.isCoupled()) {
        continue;
      }
      let curr = c;
      const chain: Chain = chainString.split(".");
      chain.forEach((part, i, all) => {
        if (i < all.length - 1) {
          if (!curr[part]) {
            curr[part] = {};
          }
          curr = curr[part];
        } else {
          const values = param.getAstValues().map((v) => v.value);
          curr[part] = values.length === 1 ? values[0] : values;
        }
        //   c[part] =
      });
    }

    return c;
  }
}
