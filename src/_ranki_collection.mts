import { type WindowRankiConfig, type CardFaces } from "./types/ranki.mjs"
import { type CollectionRenderFields } from "./types/collection.mjs"

export class Collection {
  static getFields(
    cardFace: CardFaces,
    _ranki: WindowRankiConfig,
  ): CollectionRenderFields {
    switch (cardFace) {
      case "front":
        return ["Question-Start-Pre", "Front-Prompt-Pre", "Question-End-Pre"]

      case "back":
        return ["Answer-Start-Pre", "Back-Prompt-Pre", "Answer-End-Pre"]

      default:
        return []
    }
  }
}
