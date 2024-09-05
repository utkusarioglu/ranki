// @ts-expect-error
import { mathjax } from "mathjax-full/js/mathjax";
// @ts-expect-error
import { TeX } from "mathjax-full/js/input/tex";
// @ts-expect-error
import { SVG } from "mathjax-full/js/output/svg";
// @ts-expect-error
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages";
// @ts-expect-error
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor";
// @ts-expect-error
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html";

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const mathjaxDocument = mathjax.document("", {
  InputJax: new TeX({ packages: AllPackages }),
  OutputJax: new SVG({ fontCache: "local" }),
});

const mathjaxDefaultOptions = {
  em: 12,
  ex: 8,
};

export function getMathjaxSvg(
  math: string,
  options: Record<string, string | number | boolean> = {},
): string {
  const node = mathjaxDocument.convert(math, {
    ...mathjaxDefaultOptions,
    ...options,
  });
  return adaptor.innerHTML(node);
}
