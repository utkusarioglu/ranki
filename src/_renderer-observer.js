import {  attachError } from "./_renderer-utils.js";

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
        attachError("front doesn't exist");
        return 
      }

      if (!front.className.includes(this.renderedIndicatorClass)) {
        front.classList.add(this.renderedIndicatorClass);
        front.appendChild(this.renderer.render("front"));
      }

      if (!back) {
        return;
      }

      if (!back.className.includes(this.renderedIndicatorClass)) {
        back.classList.add(this.renderedIndicatorClass);
        back.appendChild(this.renderer.render("back"));
      }
    });

    observer.observe(document.body, {
      subtree: true,
      attributes: true
    })
  }
}
