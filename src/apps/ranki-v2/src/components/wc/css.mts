import type { PropertiesHyphen } from "csstype";
import type { Wc } from "./wc.mts";
import { assertNever } from "_error/assertions.mjs";

export class WcCss {
  private self: Wc<any>;

  constructor(self: Wc<any>) {
    this.self = self;
  }

  computeTotalWidth(s: CSSStyleDeclaration | Keyframe) {
    return Object.values(this.selectWidthProperties(s)).reduce<number>(
      (a, c) => a + parseFloat(c!.toString()),
      0,
    );
  }

  selectWidthProperties(c: CSSStyleDeclaration | Keyframe) {
    return {
      width: c.width,
      paddingLeft: c.paddingLeft,
      paddingRight: c.paddingRight,
      borderLeftWidth: c.borderLeftWidth,
      borderRightWidth: c.borderRightWidth,
    };
  }

  getLeft(): number {
    return this.self.getBoundingClientRect().left;
  }

  getRight(): number {
    return this.self.getBoundingClientRect().right;
  }

  getWidth(): number {
    return this.self.getBoundingClientRect().width;
  }

  getHeight(): number {
    return this.self.getBoundingClientRect().height;
  }

  public set(c: PropertiesHyphen) {
    Object.entries(c).forEach(([p, v]) => {
      this.self.style.setProperty(p, v.toString());
    });
  }

  public remove(c: string[]) {
    c.forEach((p) => {
      this.self.style.removeProperty(p);
    });
  }

  pushStyles(...styles: string[]) {
    if (!this.self.isShadow) {
      assertNever({ why: "Cannot push styles to a non-shadow component" });
    }
    if ("adoptedStyleSheets" in Document.prototype) {
      styles.forEach((cssString) => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(cssString);

        this.self.shadowRoot!.adoptedStyleSheets = [
          ...this.self.shadowRoot!.adoptedStyleSheets,
          sheet,
        ];
      });
    } else {
      styles.forEach((cssString) => {
        const style = document.createElement("style");
        style.textContent = cssString;
        this.self.shadowRoot!.append(style);
      });
    }
  }
}
