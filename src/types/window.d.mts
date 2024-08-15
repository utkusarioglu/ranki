import { type WindowRankiConfig } from "./ranki.d.mjs"

interface CustomWindow extends Window {
  ranki: WindowRankiConfig
}
