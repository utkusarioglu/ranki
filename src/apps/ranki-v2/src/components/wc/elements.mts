import { assertArrayNotEmpty, assertNotExists } from "_error/assertions.mjs";
import type { Wc } from "./wc.mts";
import type { PropertiesHyphen } from "csstype";

export class WcElements {
  private self: Wc<any>;
  private elements: Record<string, HTMLElement | undefined> = {};

  constructor(self: Wc<any>) {
    this.self = self;
  }

  create(
    name: string,
    attributes: {
      tag: string;
      classes?: string[];
      style?: PropertiesHyphen;
    },
  ) {
    if (this.elements[name]) return;
    const el = document.createElement(attributes.tag);
    el.classList.add(...(attributes.classes || []));
    if (attributes.style) {
      Object.entries(attributes.style).forEach(([n, v]) => {
        const k = n as unknown as keyof PropertiesHyphen;
        el.style.setProperty(k, v.toString());
      });
    }
    this.elements[name] = el;
    if (this.self.isShadow) {
      this.self.shadowRoot!.appendChild(el);
    } else {
      this.self.appendChild(el);
    }
  }

  get<T extends HTMLElement>(name: string): T | undefined {
    const el = this.elements[name] as T;
    return el;
  }

  remove<T extends HTMLElement>(name: string) {
    const el = this.elements[name] as T;
    this.elements[name] = undefined;
    el?.remove();
  }

  getList(...names: string[]): HTMLElement[] {
    assertArrayNotEmpty(names, { why: "no element names given" });
    return names.map((n) => this.get(n)).filter((v) => !!v);
  }

  push(name: string, element: HTMLElement) {
    assertNotExists(this.elements[name], {
      why: "Element with the given name already exists",
    });
    this.elements[name] = element;
  }

  move(from: string, to: string) {
    this.elements[to] = this.elements[from];
    this.elements[from] = undefined;
  }
}
