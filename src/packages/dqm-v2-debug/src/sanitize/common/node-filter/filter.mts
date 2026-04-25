import type { DqmParseOutput } from "@dqm/package-dqm-api-v2";
import { assertExists } from "../../../errors/assertions.mjs";
import { tryCatch, type TryCatch } from "../../../export.mjs";
import type { SanitizedParseResult } from "../../general.types.mjs";
import { createSanitizedView } from "../class-sanitizer/sanitizer.mjs";
import type {
  ClassSanitizer,
  SanitizeModes,
} from "../class-sanitizer/sanitizer.types.mjs";
import type {
  Filters,
  Calls,
  FilterKeys,
  Keyed,
  Fields,
  Theatered,
} from "./filter.types.mjs";

export class NodeFilter<Base extends object, TypesRecord extends object> {
  protected node: ClassSanitizer<Base>;
  protected filters: Filters<TypesRecord>;
  protected calls!: Calls<TypesRecord>;

  /**
   * Creates an abstract filter instance for leaf classes
   *
   * @param sanitized - The sanitized AST node to work with.
   * @param filters - The filter preferences for field selection.
   *
   * @aidoc
   */
  constructor(node: Base, filters: Filters<TypesRecord>) {
    this.node = createSanitizedView<Base>(node);
    this.filters = filters;
  }

  /**
   * Gets the try-catch results for the specified filter keys.
   * @param props - Array of filter keys to retrieve.
   * @returns An object mapping each key to its try-catch result.
   * @private
   */
  private getCalls(props: FilterKeys<TypesRecord>[]) {
    return Object.fromEntries(
      props.map((p) => {
        const call = this.calls[p];
        assertExists(call, {
          why: "Non-existent call property requested",
          details: { request: p },
        });
        return [p, call()];
      }),
    );
  }

  /**
   * Recursively processes a list of AST nodes, creating sanitized views for each.
   * @param list - The try-catch wrapped list of AST nodes.
   * @returns A try-catch wrapped array of sanitized AST node partials.
   * @private
   *
   * @aidoc
   */
  protected recurse(list: TryCatch<Base[]>) {
    if (list.state === "fail") {
      return list;
    }

    const Child = this.constructor as any;

    const narrowed = list.value.map((n) => {
      return new Child(n, this.filters).build();
    });

    return tryCatch("narrowed", () => narrowed);
  }

  /**
   * Builds the final sanitized AST node object based on the filter preferences.
   * @returns A partial sanitized AST node with only the requested fields.
   *
   * @aidoc
   */
  build(): Keyed<TypesRecord> {
    const fields = Object.fromEntries(
      Object.entries(this.filters).map(([field, prefs]) => [
        field,
        this.getCalls(prefs),
      ]),
    ) as Fields<TypesRecord>;
    return {
      key: Date.now().toString(),
      fields,
    };
  }
}

export function filterCommon<T extends object>(
  parsed: SanitizedParseResult,
  callback: (success: DqmParseOutput) => Theatered<T>[],
): SanitizeModes<Theatered<T>[]> {
  try {
    if (parsed.state !== "success") {
      return {
        state: "fail",
        error: parsed.error,
      };
    }

    const sanitized = callback(parsed.data);
    return {
      state: "success",
      data: sanitized,
    };
  } catch (e) {
    console.log(e);
    return {
      state: "fail",
      error: e as any,
    };
  }
}
