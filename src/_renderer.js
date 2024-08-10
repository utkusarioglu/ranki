import { Observer } from "./_renderer-observer.js";
import { Renderer } from "./_renderer-renderer.js";
import { attachError, hudContent } from "./_renderer-utils.js";


function main(ankiRender) {
  if (!ankiRender) {
    attachError("`window.ankiRender` not defined");
  }

  const {version, features, card, content} = ankiRender;
  const required = [version, features, card, content]
  const allDefined = required.reduce((a, c) => a && (c !== undefined), true);
  if (!allDefined) {
    attachError("`window.ankiRender` aren't all defined");
  }

  const renderer = new Renderer(ankiRender);
  new Observer(ankiRender, "div.render-root", renderer).observe();

  hudContent(ankiRender);
}

main(window.ankiRender);
