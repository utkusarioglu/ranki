import { Dom } from "./dom/dom.mts";
import { Collection } from "./collection.mts";
import { Parser } from "./parser/parser.mts";
import type { CardFaces } from "./types/ranki.d.mts";
import type { WindowRankiConfig } from "./config/config.d.mjs";
import { getRanki } from "./config/config.mts";

/**
 * Anki behaves differently on different platforms. In some, it rerenders the
 * entire page when the answer is displayed and in some it appends the back card
 * elements into the document.
 *
 * This Observer ensures that the front and back fields are only attached when
 * they need to be attached.
 *
 * *Which means, this class is what decides when renders happen.*
 */
export class Observer {
  private faceSelector: string;
  // private parser: Parser;
  // private ranki: WindowRankiConfig;

  constructor(faceSelector: string) {
    if (!faceSelector) {
      throw new Error("Observer requires face selector");
    }

    // if (!parser) {
    //   throw new Error("Observer requires `parser`");
    // }

    // if (!ranki) {
    //   throw new Error("Observer requires `ranki`");
    // }

    this.faceSelector = faceSelector;
    // this.parser = parser;
    // this.ranki = ranki;
  }

  _checkAndProcessFace(faceName: CardFaces, faceElem: Element) {
    const ranki = getRanki();
    const dom = new Dom(faceElem, ranki);
    if (!dom.hasFaceRendered()) {
      const parser = new Parser(ranki);
      const fields = Collection.getFields(faceName, ranki);
      const parsed = parser.parseFields(fields);
      dom.renderFace(parsed);
    }
  }

  _processHud() {
    const ranki = getRanki();
    const dom = new Dom(document.body, ranki);
    dom.renderHud();
  }

  observe() {
    const observer = new MutationObserver((_entries, _obs) => {
      this._processHud();

      const [frontElem, backElem] = document.querySelectorAll(
        this.faceSelector,
      );

      if (!frontElem) {
        throw new Error("Front face element doesn't exist");
      }

      this._checkAndProcessFace("front", frontElem);

      if (!backElem) {
        return;
      }

      this._checkAndProcessFace("back", backElem);
    });

    observer.observe(document.body, {
      subtree: true,
      attributes: true,
    });
  }
}
