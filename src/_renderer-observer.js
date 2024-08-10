import {  attachError } from "./_renderer-utils.js";
import { Dom } from "./_renderer-dom.js";

export class Observer {
  renderedIndicatorClass = "rendered";

  constructor(ankiRender, selector, renderer)
  {
    this.selector = selector;
    this.anki = ankiRender;
    this.renderer = renderer;
  }

  observe()
  {
    if (!this.anki || !this.selector) {
      return;
    }

    const observer = new MutationObserver((_entries, _obs) =>
    {
      const matches = document.querySelectorAll(this.selector);
      const front = matches[0];
      const back = matches[1];
      
      if (!front) {
        attachError("Front doesn't exist");
        return 
      }

      if (!front.className.includes(this.renderedIndicatorClass)) {
        front.classList.add(this.renderedIndicatorClass);
        const dom = new Dom(front);
        const fields = dom.getFields(this.anki.card, "front");
        const parsed = this.renderer.parse(fields);
        dom.render(parsed);
      }

      if (!back) {
        return;
      }

      if (!back.className.includes(this.renderedIndicatorClass)) {
        back.classList.add(this.renderedIndicatorClass);
        const dom = new Dom(back);
        const fields = dom.getFields(this.anki.card, "back");
        const parsed = this.renderer.parse(fields);
        dom.render(parsed);
      }
    });

    observer.observe(document.body, {
      subtree: true,
      attributes: true
    })
  }
}
