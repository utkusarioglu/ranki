import { type RankiContent } from "./ranki-content.d.mjs"

export interface RankiTokens {
  frame: string
  child: string
  terminator: string
  parameter: string
  assignment: string
  comment: string
  heading: string
  centeredText: string
  deckSeparator: string
  tagSeparator: string
  tableHeads: string
  tableHeadTags: string
  tableFoots: string
  tableFootTags: string
  tableBodyTags: string
  listTags: string
  listItem: string
  dlDtTags: string
  dlDdTags: string
}

export interface RankiFeatures {}

export interface RankiCard {
  deck: string
  subdeck: string
  tags: string
  type: string
  flag: string
  card: string
}

export interface WindowRankiConfig {
  version: "v1"
  tokens: RankiTokens
  features: RankiFeatures
  card: RankiCard
  content: RankiContent
}

export type RankiRequiredProps = "version" | "features" | "card" | "content"

export type CardFaces = "front" | "back"
