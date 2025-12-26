import type {
  AliasList,
  ChainList,
  ChainListString,
  ChainStringList,
  ICps,
  ICpx,
  IdList,
  IdListString,
  IdStringList,
} from "@dqm/package-dqm-api-v2";
import { Cps } from "../cps.mjs";
import { DqmAppError } from "../../../errors/dqm-app-error/dqm-app-error.mjs";
import type { CommonTransports } from "../../common-transports.mjs";
import { assertArrayNotEmpty } from "@dqm/package-dqm-utils";

export const CHAIN_STRING_SEPARATOR = "/";
export const ID_STRING_SEPARATOR = "#";
export const ALIAS_STRING_SEPARATOR = "|";

/**
 * @dev
 * #1 This prevents circular type inference. If generic `T` is defined to
 * extend `ICpx`, then this error goes away but the class definition for
 * `collection` detects the circular reference and assumes the `any` type.
 */
export function cpsCollectionCapability<T>(self: T) {
  let cps: ICps[] = [];

  return {
    setIdList(
      idList: IdList,
      getParent: ICpx["getParent"],
      getTransports: CommonTransports["getTransports"],
      getAstParamsByAudience: ICpx["getAstParamsByAudience"],
    ): T {
      const createRoot = () => {
        const parentCpx = getParent();
        const parentCps = parentCpx ? parentCpx.getLeafCps() : null;
        const newCps: ICps = new Cps(getTransports());
        if (parentCps) {
          newCps.setParent(parentCps);
        }
        newCps
          .setCpx(
            // @ts-expect-error #1
            self,
          )
          .setDefinition({
            id: idList[0],
            params: getAstParamsByAudience(0),
          });
        return newCps as ICps;
      };

      switch (idList.length) {
        case 0:
          throw new DqmAppError({
            code: "CHAIN_LIST_EMPTY",
            why: "Was given an Id of length 0",
            cause: null,
            details: { cpx: this },
          });
        case 1:
          cps.push(createRoot());
          return self;
        default:
          let curr = createRoot();
          cps.push(curr);
          for (let i = 1; i < idList.length; i++) {
            const prev = curr;
            curr = new Cps(getTransports())
              .setCpx(
                // @ts-expect-error # 1
                self,
              )
              .setParent(prev)
              .setDefinition({
                id: idList[i],
                params: getAstParamsByAudience(i),
              });
            cps.push(curr);
          }
          return self;
      }
    },

    getLeafCps(): ICps {
      assertArrayNotEmpty(cps, { why: "Cpx has to collect at least one Cps" });
      return cps.at(-1)!;
    },

    getRootCps(): ICps {
      assertArrayNotEmpty(cps, { why: "Cpx has to collect at least one Cps" });
      return cps[0];
    },

    getCpsList(): ICps[] {
      return cps;
    },

    getChainList(): ChainList {
      return cps.map((cps) => cps.getChain());
    },

    getChainStringList(): ChainStringList {
      return cps.map((cps) => cps.getChainString());
    },

    getIdStringList(): IdStringList {
      return cps.map((cps) => cps.getIdString());
    },

    getIdListString(): IdListString {
      return cps.map((cps) => cps.getIdString()).join(ID_STRING_SEPARATOR);
    },

    getChainListString(): ChainListString {
      return cps
        .map((cps) => cps.getChainString())
        .join(CHAIN_STRING_SEPARATOR);
    },

    getIdList(): IdList {
      return cps.map((cps) => cps.getId());
    },

    getAliasList(): AliasList {
      return cps.map((c) => c.getAlias());
    },
  };
}
