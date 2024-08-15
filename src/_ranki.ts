import { type CustomWindow } from "./types/window.mjs"
import {
  type RankiRequiredProps,
  type WindowRankiConfig,
} from "./types/ranki.mjs"
import { Dom } from "./_ranki_dom.mjs"
import { Observer } from "./_ranki_observer.mjs"
import { Parser } from "./_ranki_parser.mjs"
import { rankiDefaults } from "./_ranki_config.mjs"

declare var window: CustomWindow

function globalErrorHandler(e: ErrorEvent) {
  e.preventDefault()
  const dom = new Dom(document.body, window.ranki)
  dom.renderError(e.error.message, e.error.stack)
  console.error(e)
}

// window.addEventListener("unhandledrejection", globalErrorHandler)
window.addEventListener("error", globalErrorHandler)

window.ranki = {
  ...rankiDefaults,
  ...window.ranki,
}

function checkParams(ranki: WindowRankiConfig) {
  if (!ranki) {
    throw new Error("`window.ranki` is not defined")
  }

  const REQUIRED_RANKI_PROPS: RankiRequiredProps[] = [
    "version",
    "features",
    "card",
    "content",
  ]

  const allDefined = REQUIRED_RANKI_PROPS.every(
    (prop) => ranki[prop] !== undefined,
  )

  if (!allDefined) {
    throw new Error("`window.ranki` aren't all defined.")
  }
}

function main(ranki: WindowRankiConfig) {
  checkParams(ranki)

  const parser = new Parser(ranki)
  new Observer("div.ranki-root", parser, ranki).observe()
}

main(window.ranki)
