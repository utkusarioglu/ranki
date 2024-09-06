import type { RankiDefaults, WindowRankiConfig } from "./config.d.mjs";
import type { CustomWindow } from "../types/window.d.mts";

declare var window: CustomWindow;

const rankiDefaults: RankiDefaults = {
  features: {},
  tokens: {
    cardTypesPrefix: "+Ranki-",
    frame: ":::",
    inlineFrameAllowedEndCharacters: ["\\s", "?", "!", ":", "\\.", ","],

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

  replacements: [
    ["&lt;", "<"],
    ["&gt;", ">"],
    ["&amp;", "&"],
    ["<p>", ""],
    ["</p>", ""],
  ],

  audioSynthesis: {
    defaults: {
      waveform: "sine",
      amplitude: 1,
    },
  },

  aliases: {
    code: {
      autohotkey: {
        list: ["autohotkey", "ahk"],
        displayName: "AutoHotkey",
      },
      awk: {
        list: ["awk", "mawk", "nawk", "gawk"],
        displayName: "Awk",
      },
      bash: {
        list: ["bash", "zsh"],
        displayName: "Bash",
      },
      sh: {
        list: ["sh"],
        displayName: "Bourne shell",
      },
      cpp: {
        list: ["cpp", "c++", "hpp", "cc", "hh", "h++", "cxx", "hxx"],
        displayName: "C++",
      },
      cmake: {
        list: ["cmake"],
        displayName: "CMake",
      },
      css: {
        list: ["css"],
        displayName: "CSS",
      },
      dockerfile: {
        list: ["dockerfile", "docker"],
        displayName: "Dockerfile",
      },
      dos: {
        list: ["dos", "bat", "cmd"],
        displayName: "DOS",
      },
      xlsx: {
        list: ["excel", "xls", "xlsx"],
        displayName: "Excel",
      },
      gradle: {
        list: ["gradle"],
        displayName: "Gradle",
      },
      graphql: {
        list: ["graphql", "gql"],
        displayName: "GraphQL",
      },
      xml: {
        list: [
          "xml",
          "xhtml",
          "rss",
          "atom",
          "xjb",
          "xsd",
          "xsl",
          "plist",
          "svg",
        ],
        displayName: "XML",
      },
      http: {
        list: ["http", "https"],
        displayName: "HTTP",
      },
      hcl: {
        list: ["hcl", "tf", "terraform"],
        displayName: "Hcl",
      },
      html: {
        list: ["html", "htm"],
        displayName: "HTML",
      },
      ini: {
        list: ["ini", "toml", "conf"],
        displayName: "INI",
      },
      json: {
        list: ["json"],
        displayName: "JSON",
      },
      tex: {
        list: ["latex", "tex"],
        displayName: "LaTex",
      },
      makefile: {
        list: ["makefile", "mk", "mak", "make"],
        displayName: "Makefile",
      },
      nginx: {
        list: ["nginx", "nginxconf"],
        displayName: "Nginx",
      },
      php: {
        list: ["php"],
        displayName: "PHP",
      },
      javascript: {
        list: ["js", "cjs", "mjs", "javascript"],
        displayName: "JavaScript",
      },
      pwsh: {
        list: ["powershell", "pwsh", "ps", "ps1"],
        displayName: "PowerShell",
      },
      python: {
        list: ["py", "python"],
        displayName: "Python",
      },

      scss: {
        list: ["sass", "scss"],
        displayName: "Sass",
      },
      solidity: {
        list: ["solidity", "sol"],
        displayName: "Solidity",
      },
      supercollider: {
        list: ["supercollider", "scd", "sc"],
        displayName: "SuperCollider",
      },
      sql: {
        list: ["sql"],
        displayName: "SQL",
      },
      postgres: {
        list: ["pgsql", "postgres", "postgresql", "plpgsql"],
        displayName: "PL/pgSQL",
      },
      typescript: {
        list: ["ts", "mts", "typescript"],
        displayName: "TypeScript",
      },
      vim: {
        list: ["vim"],
        displayName: "VimScript",
      },
      yaml: {
        list: ["yml", "yaml"],
        displayName: "Yaml",
      },
      yul: {
        list: ["yul"],
        displayName: "YUL",
      },
    },
  },
};

export function getRanki(): WindowRankiConfig {
  return {
    ...rankiDefaults,
    ...window.ranki,
  };
}
