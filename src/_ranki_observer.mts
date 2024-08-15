import { Dom } from "./_ranki_dom.mjs"
import { Collection } from "./_ranki_collection.mjs"
import { type Parser } from "./_ranki_parser.mjs"
import { type CardFaces, type WindowRankiConfig } from "./types/ranki.mjs"

export class Observer {
  private faceSelector: string
  private parser: Parser
  private ranki: WindowRankiConfig

  constructor(faceSelector: string, parser: Parser, ranki: WindowRankiConfig) {
    if (!faceSelector) {
      throw new Error("Observer requires face selector")
    }

    if (!parser) {
      throw new Error("Observer requires `parser`")
    }

    if (!ranki) {
      throw new Error("Observer requires `ranki`")
    }

    this.faceSelector = faceSelector
    this.parser = parser
    this.ranki = ranki
  }

  _checkAndProcessFace(faceName: CardFaces, faceElem: Element) {
    const dom = new Dom(faceElem, this.ranki)
    if (!dom.hasRendered()) {
      const fields = Collection.getFields(faceName, this.ranki)
      const parsed = this.parser.parseFields(fields)
      dom.renderFace(parsed)
    }
  }

  _processHud() {
    const dom = new Dom(document.body, this.ranki)
    dom.renderHud()
  }

  observe() {
    const observer = new MutationObserver((_entries, _obs) => {
      this._processHud()

      const [frontElem, backElem] = document.querySelectorAll(this.faceSelector)

      if (!frontElem) {
        throw new Error("Front face element doesn't exist")
      }

      this._checkAndProcessFace("front", frontElem)

      if (!backElem) {
        return
      }

      this._checkAndProcessFace("back", backElem)
    })

    observer.observe(document.body, {
      subtree: true,
      attributes: true,
    })
  }
}