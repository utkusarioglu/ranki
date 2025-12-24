import type { ICpx } from "@dqm/package-dqm-api-v2";
import { tryCatch, type TryCatch } from "./utils.mts";

type Consume<T> = TryCatch<T>;

// ANKI
type ClassSanitizer<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => Consume<R>
    : Consume<T[K]>;
} & {
  original: T;
};

export type ICpxSanitized = ClassSanitizer<ICpx>;

// ANKI
function wrapWithTryCatch<T extends object>(
  instance: T,
  consume: <K extends keyof T>(key: K, value: any) => any,
): ClassSanitizer<T> {
  const out = {} as any;

  for (const k of Object.keys(instance) as (keyof T)[]) {
    const v = instance[k];

    out[k] =
      typeof v === "function"
        ? (...args: any[]) => consume(k, () => v.apply(instance, args))
        : v;
  }

  return out;
}

export function createSanitizedView<C extends object>(
  source: C,
): ClassSanitizer<C> {
  const sanitized = wrapWithTryCatch(source, tryCatch);

  return Object.assign(sanitized, {
    original: source,
  });
}

// export const SanitizedCpx = createSanitizedView<ICpx>({} as ICpx);
