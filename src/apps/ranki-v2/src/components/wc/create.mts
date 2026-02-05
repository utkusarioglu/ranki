import type { Wc } from "./wc.mts";

export function WcCreate<T, C extends new () => Wc<T>>(self: C, tag: string) {
  function define() {
    if (!customElements.get(tag)) {
      customElements.define(tag, self);
    }
  }

  return {
    instance(props: T, attach?: HTMLElement | ShadowRoot): InstanceType<C> {
      define();
      const el = new self() as InstanceType<C>;
      el.initialize();
      el.state.set(props);
      // el.animation.run("enter");
      if (attach) {
        attach.appendChild(el);
      }
      return el;
    },

    singleton(
      props: T,
      attach: HTMLElement | ShadowRoot,
    ): { element: InstanceType<C>; created: boolean } {
      define();

      let element = attach.querySelector(tag) as InstanceType<C> | null;
      let created = false;

      if (!element) {
        element = this.instance(props);
        if (attach) {
          attach.appendChild(element);
        }
        created = true;
      } else {
        element.state.set(props);
      }

      return { element, created };
    },
  };
}
