import { mathjax } from "mathjax-full/js/mathjax.js";
import { TeX } from "mathjax-full/js/input/tex.js";
import { SVG } from "mathjax-full/js/output/svg.js";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js";
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages.js";

// Set up adaptor and handler
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

// Configure MathJax document
const tex = new TeX({ packages: AllPackages });
const svg = new SVG({ fontCache: "local" });
const mjDocument = mathjax.document("", { InputJax: tex, OutputJax: svg });

// Default render options
const defaultOptions = {
  display: true,
  em: 16,
  ex: 8,
  // containerWidth: 80 * 16,
};

// Render LaTeX → SVG string
export function getMathjaxSvg(
  latex: string,
  options: Record<string, string | number | boolean> = {},
): string {
  const node = mjDocument.convert(latex, { ...defaultOptions, ...options });
  return adaptor.innerHTML(node);
}

// (Optional) Insert into DOM
export function renderMathjaxTo(node: HTMLElement, latex: string) {
  node.innerHTML = getMathjaxSvg(latex);
}
