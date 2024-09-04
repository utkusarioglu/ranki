import { mathjax } from "mathjax-full/js/mathjax";
import { TeX } from "mathjax-full/js/input/tex";
import { SVG } from "mathjax-full/js/output/svg";
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html";

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const mathjaxDocument = mathjax.document("", {
  InputJax: new TeX({ packages: AllPackages }),
  OutputJax: new SVG({ fontCache: "local" }),
});

console.log(mathjaxDocument);

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
