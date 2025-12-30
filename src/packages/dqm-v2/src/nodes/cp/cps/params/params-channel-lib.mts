import type {
  ChannelParamSpecs,
  IAstParamNode,
  ParamChannel,
  Alias,
  Chain,
  CommonTransportsConstructorParams,
  ICpsParam,
  MutationEntry,
} from "@dqm/package-dqm-api-v2";
import { IdLib } from "../../../../id/id-lib.mjs";
import { rejectValues } from "@dqm/package-dqm-utils";
import { CommonTransports } from "../../../../nodes/common-transports.mjs";
import { POSITIONAL_PARAM } from "../../../../constants.mjs";
import { DqmAppError } from "../../../../errors/dqm-app-error/dqm-app-error.mjs";
import { assertExists } from "@dqm/package-dqm-utils";
import { CpsParam } from "./cps-param.mjs";
import { assertNever } from "../../../../errors/dqm-app-error/assertions.mjs";

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
   * #1 Creates all params that the component plugin sets to be assignable by
   * the source code. Anything AstParam that don't bind with the chain or alias
   * of one of the CpsParam is handled in accordance with the error settings.
   * It may throw or can be silently discarded.
   */
  private processSchema() {
    this.schema.params.forEach((p) => {
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
      this.handleOrphanParam(e, ast);
    }
  }

  private handleOrphanParam(error: unknown, ast: IAstParamNode) {
    const initial = this.getInitialConfig();
    switch (initial.plugins.onOrphanParam) {
      case "ignore":
        break;
      case "warn":
        this.failed.push(ast);
        break;
      case "fail":
        throw new DqmAppError({
          code: "ORPHAN_PARAM",
          why: "Param doesn't exist in schema and the initial configuration is set to fail on orphan params",
          cause: error,
          details: {
            userSuppliedParamId: ast.getId(),
            schema: this.schema,
          },
        });
      default:
        assertNever({
          why: "All orphan param choices should have been depleted",
          cause: error,
        });
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
    p.setAstParam(user);
    return this;
  }

  @rejectValues(undefined)
  findById(id: Alias | Chain): ICpsParam | never {
    return this.lib.getObjectById(id);
  }

  getMutationEntries(includeChannel: boolean): MutationEntry[] {
    return Array.from(this.lib.peekActiveChains())
      .map(([_, param]) => param.getMutationEntries(includeChannel))
      .flat();
  }
}
