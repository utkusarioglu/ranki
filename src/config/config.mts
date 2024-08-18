import type { RankiDefaults } from "./config.d.mjs";

export const rankiDefaults: RankiDefaults = {
  features: {},
  tokens: {
    frame: ":::",

    child: " ",
    terminator: ";",
    parameter: ",",

    assignment: ":",

    comment: "% ",
    heading: "# ",

    centeredText: "   ",

    deckSeparator: "::",
    tagSeparator: " ",

    tableHeads: "HEADS",
    tableHeadTags: "HEAD_TAGS",
    tableFoots: "FOOTS",
    tableFootTags: "FOOT_TAGS",
    tableBodyTags: "BODY_TAGS",

    listTags: "LI_TAGS",
    listItemSeparator: "-",

    dlDtTags: "DT_TAGS",
    dlDdTags: "DD_TAGS",
  },
  aliases: {
    code: {
      javascript: {
        list: ["js", "cjs", "mjs", "javascript"],
        displayName: "JavaScript",
      },
      typescript: {
        list: ["ts", "mts", "typescript"],
        displayName: "TypeScript",
      },
      pwsh: {
        list: ["powershell", "pwsh"],
        displayName: "PowerShell",
      },
      hcl: {
        list: ["hcl", "tf", "terraform"],
        displayName: "Hcl",
      },
    },
  },
};
